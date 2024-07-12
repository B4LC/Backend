import { ChangeProfile } from "./dtos/changeProfile.dto";
import { CreateUserDto } from "./dtos/createUser.dto";
import { UserRepository } from "./user.repository";

export class UserService {
  private readonly userRepository = new UserRepository();
  async getaAllUser() {
    return this.userRepository.getAllUser();
  }
  async getAllCustomer() {
    return this.userRepository.getAllCustomer();
  }
  async getAllBank() {
    return this.userRepository.getAllBank();
  }
  async changeProfile(userID: string, userProfile: ChangeProfile) {
    return this.userRepository.changeProfile(userID, userProfile);
  }
  async getUserInfo(userID: string) {
    return this.userRepository.getUserInfo(userID);
  }
  async createUser(user: CreateUserDto) {
    return this.userRepository.createUser(user);
  }
}
