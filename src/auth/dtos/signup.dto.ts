import { UserRole } from "user/enums/user-role.enum";

export class SignupDto {
    contractId: number;
    username: string;
    email: string;
    password: string;
    role: UserRole;
}