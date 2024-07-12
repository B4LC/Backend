import { UserModel } from "../model";
import { UserRole } from "./enums/user-role.enum";
import { ChangeProfile } from "./dtos/changeProfile.dto";
import { NotFoundError } from "routing-controllers";
import { CreateUserDto } from "./dtos/createUser.dto";

export class UserRepository {
  async getAllUser() {
    const banks = await UserModel.find({ role: UserRole.BANK })
      .select({
        _id: 1,
        username: 1,
        address: 1,
        role: 1,
        email: 1,
        phoneNumber: 1,
      })
      .lean()
      .exec();
    const finalBanks = await Promise.all(
      banks.map((bank) => {
        const _id = bank._id.toString();
        return { ...bank, _id };
      })
    );
    const customers = await UserModel.find({ role: UserRole.USER })
      .select({
        _id: 1,
        username: 1,
        address: 1,
        role: 1,
        email: 1,
        phoneNumber: 1,
      })
      .lean()
      .exec();
    const finalCustomers = await Promise.all(
      customers.map((customer) => {
        const _id = customer._id.toString();
        return { ...customer, _id };
      })
    );
    return {
      banks: finalBanks,
      customers: finalCustomers,
    };
  }
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
      await curUser.save();
      return { message: "Update information successfully" };
    }
  }
  async getUserInfo(userAddress: string) {
    let curUser = await UserModel.findOne({ address: userAddress }).lean();
    if (!curUser) {
      throw new NotFoundError("User not found");
    }
    return {
      username: curUser?.username,
      email: curUser?.email,
      phoneNumber: curUser?.phoneNumber,
      address: curUser?.address,
      role: curUser?.role,
    };
  }
  async createUser(user: CreateUserDto) {
    const curUser = await UserModel.findOne({ address: user.address }).lean();
    if (!curUser) {
      const newUser = new UserModel(user);
      await newUser.save();
      return { message: "Create user successfully" };
    } else {
      await UserModel.findByIdAndUpdate(curUser._id, user);
      return { message: "Update user successfully" };
    }
  }
}
