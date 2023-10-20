import { ChangeProfile } from "./dtos/changeProfile.dto";
import { UserRepository } from "./user.repository";

export class UserService {
    private readonly userRepository = new UserRepository();
    async getAllBank() {
        return this.userRepository.getAllBank();
    }
    async changeProfile(userID: string, userProfile: ChangeProfile) {
        return this.userRepository.changeProfile(userID, userProfile);
    }
    async getUserInfo(userID: string) {
        return this.userRepository.getUserInfo(userID);
    }
}