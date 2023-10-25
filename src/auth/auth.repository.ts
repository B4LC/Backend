import { compareSync, hashSync } from "bcrypt";
import { sign, verify } from "jsonwebtoken";
import { BadRequestError } from "routing-controllers";
import { redisClient } from "../config/redis-client";
import { LoginDto } from "./dtos/login.dto";
import { UserModel } from "../model";
import { SignupDto } from "./dtos/signup.dto";
require("dotenv").config();

export class AuthRepository {
  private hashPassword(password: string, rounds: number): string {
    return hashSync(password, rounds);
  }

  private comparePassword(password: string, hashedPassword: string): boolean {
    return compareSync(password, hashedPassword);
  }

  private generateToken(
    username: string,
    email: string,
    role: string,
    secret: string,
    expiresIn: string
  ): string {
    return sign(
      {
        username,
        email,
        role,
      },
      secret,
      { expiresIn }
    );
  }

  private async logTokenToRedis(
    email: string,
    refreshToken: string,
    accessToken: string
  ) {
    const redisKey = `auth:${email}:${refreshToken}`;
    await redisClient.set(redisKey, accessToken);
    redisClient.expire(
      redisKey,
      Number.parseInt(process.env.JWT_REFRESH_EXPIRES_IN)
    );
  }

  private async removeTokenFromRedis(email: string, refreshToken: string) {
    redisClient.del(`auth:${email}:${refreshToken}`);
  }

  async getUserPassword(email: string) {
    return UserModel.findOne({ email })
      .select({
        _id: 0,
        username: 1,
        email: 1,
        password: 1,
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
    const { email, password } = loginDto;
    let role: string;
    let username: string;
    try {
      const user = await this.getUserPassword(email);
      if (!user) throw new Error(`Email ${email} does not exist.`);
      if (!this.comparePassword(password, user.password))
        throw new Error("Incorrect password");
      role = user.role;
      username = user.username;
      console.log(username);

      const {
        JWT_SECRET,
        JWT_EXPIRES_IN,
        JWT_REFRESH_SECRET,
        JWT_REFRESH_EXPIRES_IN,
      } = process.env;

      const accessToken = this.generateToken(
        username,
        email,
        role,
        JWT_SECRET,
        JWT_EXPIRES_IN
      );
      const refreshToken = this.generateToken(
        username,
        email,
        role,
        JWT_REFRESH_SECRET,
        JWT_REFRESH_EXPIRES_IN
      );

      this.logTokenToRedis(email, refreshToken, accessToken);
      return {
        accessToken,
        refreshToken,
      };
    } catch (e) {
      throw new BadRequestError("Email or password is incorrect.");
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

      const { username, email, role } = tokenPayload;
      const hasRefreshToken = await redisClient.exists(
        `auth:${email}:${refreshToken}`
      );
      if (!hasRefreshToken) {
        throw new Error("Invalid refresh token.");
      }
      this.removeTokenFromRedis(email, refreshToken);
      if (refreshPayload.email !== email) {
        throw new Error("Tokens mismatch.");
      }

      const newAccessToken = this.generateToken(
        username,
        email,
        role,
        JWT_SECRET,
        JWT_EXPIRES_IN
      );
      const newRefreshToken = this.generateToken(
        username,
        email,
        role,
        JWT_REFRESH_SECRET,
        JWT_REFRESH_EXPIRES_IN
      );

      this.logTokenToRedis(email, newRefreshToken, newAccessToken);

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
      const { email } = payload as Record<string, string>;
      redisClient.del(`auth:${email}:${refreshToken}`);
    } catch (e) {
      throw new BadRequestError(e.message);
    }
  }
}
