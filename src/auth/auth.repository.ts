import { compareSync, hashSync } from "bcrypt";
import { sign, verify } from "jsonwebtoken";
import { BadRequestError } from "routing-controllers";
import { redisClient } from "../config/redis-client";
import { LoginDto } from "./dtos/login.dto";
import { UserModel } from "../model";
import { SignupDto } from "./dtos/signup.dto";
import { ethers } from "ethers";
require("dotenv").config();

export class AuthRepository {
  private hashPassword(password: string, rounds: number): string {
    return hashSync(password, rounds);
  }

  private comparePassword(password: string, hashedPassword: string): boolean {
    return compareSync(password, hashedPassword);
  }

  private generateToken(
    address: string,
    role: string,
    secret: string,
    expiresIn: string
  ): string {
    return sign(
      {
        address,
        role,
      },
      secret,
      { expiresIn }
    );
  }

  private async logTokenToRedis(
    address: string,
    refreshToken: string,
    accessToken: string
  ) {
    const redisKey = `auth:${address}:${refreshToken}`;
    await redisClient.set(redisKey, accessToken);
    redisClient.expire(
      redisKey,
      Number.parseInt(process.env.JWT_REFRESH_EXPIRES_IN)
    );
  }

  private async removeTokenFromRedis(address: string, refreshToken: string) {
    redisClient.del(`auth:${address}:${refreshToken}`);
  }

  async getUserAddress(address: string) {
    return UserModel.findOne({ address })
      .select({
        _id: 0,
        username: 1,
        email: 1,
        address: 1,
        role: 1,
      })
      .lean();
  }

  async signup(signupDto: SignupDto) {
    const { username, email, password, role } = signupDto;
    const user = await UserModel.findOne({ email }).exec();
    if (user) {
      return { message: "Email is already taken" };
    } else {
      const hashedPassword = this.hashPassword(password, 10);
      const newUser = new UserModel({
        username,
        email,
        password: hashedPassword,
        role,
      });
      await newUser.save();
      return { message: "Register successfully" };
    }
  }

  async login(loginDto: LoginDto) {
    const { signedMessage, message, address, role } = loginDto;
    try {
      const {
        JWT_SECRET,
        JWT_EXPIRES_IN,
        JWT_REFRESH_SECRET,
        JWT_REFRESH_EXPIRES_IN,
      } = process.env;
      
      const recoveredAddress = ethers.utils.verifyMessage(message, signedMessage);
      if(recoveredAddress !== address) {
        throw new BadRequestError('Invalid signature');
      }
      const user = await UserModel.findOne({ address }).exec();
      if(!user) {
        const newUser = new UserModel({
          address,
          role,
        });
        await newUser.save();
      }
      const accessToken = this.generateToken(
        address,
        role,
        JWT_SECRET,
        JWT_EXPIRES_IN
      );
      const refreshToken = this.generateToken(
        address,
        role,
        JWT_REFRESH_SECRET,
        JWT_REFRESH_EXPIRES_IN
      );

      this.logTokenToRedis(address, refreshToken, accessToken);
      return {
        accessToken,
        refreshToken,
      };
    } catch (e) {
      console.log(e)
      throw new BadRequestError("There's something wrong in login");
    }
  }
  /* eslint-disable @typescript-eslint/no-explicit-any */

  async refreshTokens(accessToken: string, refreshToken: string) {
    const {
      JWT_SECRET,
      JWT_EXPIRES_IN,
      JWT_REFRESH_SECRET,
      JWT_REFRESH_EXPIRES_IN,
    } = process.env;

    try {
      const refreshPayload: any = verify(refreshToken, JWT_REFRESH_SECRET);
      const tokenPayload: any = verify(accessToken, JWT_SECRET, {
        ignoreExpiration: true,
      });

      const { address, role } = tokenPayload;
      const hasRefreshToken = await redisClient.exists(
        `auth:${address}:${refreshToken}`
      );
      if (!hasRefreshToken) {
        throw new Error("Invalid refresh token.");
      }
      this.removeTokenFromRedis(address, refreshToken);
      if (refreshPayload.address !== address) {
        throw new Error("Tokens mismatch.");
      }

      const newAccessToken = this.generateToken(
        address,
        role,
        JWT_SECRET,
        JWT_EXPIRES_IN
      );
      const newRefreshToken = this.generateToken(
        address,
        role,
        JWT_REFRESH_SECRET,
        JWT_REFRESH_EXPIRES_IN
      );

      this.logTokenToRedis(address, newRefreshToken, newAccessToken);

      return {
        accessToken: newAccessToken,
        refreshToken: newRefreshToken,
      };
    } catch (e) {
      throw new BadRequestError(e.message);
    }
  }
  /* eslint-enable */

  async logout(refreshToken: string) {
    try {
      const payload = verify(refreshToken, process.env.JWT_REFRESH_SECRET);
      const { address } = payload as Record<string, string>;
      redisClient.del(`auth:${address}:${refreshToken}`);
    } catch (e) {
      throw new BadRequestError(e.message);
    }
  }
}
