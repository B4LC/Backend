import { UserModel } from "../model";
import { UserRole } from "./enums/user-role.enum";
import { ChangeProfile } from "./dtos/changeProfile.dto";
import { NotFoundError } from "routing-controllers";
import mongoose from "mongoose";

export class UserRepository {
  async getAllBank() {
    const banks = await UserModel.find({ role: UserRole.BANK });
    const res: any[] = [];
    banks.forEach((bank) => {
      res.push(bank.username);
    });
    return res;
  }
  async getAllCustomer() {
    const banks = await UserModel.find({ role: UserRole.USER });
    const res: any[] = [];
    banks.forEach((bank) => {
      res.push(bank.username);
    });
    return res;
  }
  async changeProfile(userID: string, userProfile: ChangeProfile) {
    const curUser = await UserModel.findById(userID);
    if (!curUser) {
      throw new NotFoundError("User not found");
    } else {
      curUser.username = userProfile.username;
      curUser.email = userProfile.email;
      curUser.phoneNumber = userProfile.phoneNumber;
      curUser.address = userProfile.address;
      await curUser.save();
      return { message: "Update information successfully" };
    }
  }
  async getUserInfo(userAddress: string) {
    let curUser = await UserModel.findOne({ address: userAddress }).lean();
    if (!curUser) {
      const newUser = new UserModel({
        address: userAddress,
        role: UserRole.USER,
      });
      await newUser.save();
      curUser = newUser;
    }
    return {
      username: curUser?.username,
      email: curUser?.email,
      phoneNumber: curUser?.phoneNumber,
      address: curUser?.address,
      role: curUser?.role
    };
  }
}
