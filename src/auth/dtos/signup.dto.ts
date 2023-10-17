import { UserRole } from "user/enums/user-role.enum";

export class SignupDto {
    username: string;
    email: string;
    password: string;
    role: UserRole;
}