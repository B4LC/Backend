import { UserRole } from "user/enums/user-role.enum";

export class CreateUserDto {
  username: string;
  email: string;
  phoneNumber: string;
  address: string;
  role: UserRole;
}
