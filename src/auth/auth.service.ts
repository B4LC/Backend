import { LoginDto } from './dtos/login.dto';
import { AuthRepository } from './auth.repository';
import { SignupDto } from './dtos/signup.dto';

export class AuthService {
  private readonly authRepository = new AuthRepository();

  async signup(signupDto: SignupDto) {
    return this.authRepository.signup(signupDto);
  }
  
  async login(loginDto: LoginDto) {
    return this.authRepository.login(loginDto);
  }

  async refreshTokens(accessToken: string, refreshToken: string) {
    return this.authRepository.refreshTokens(accessToken, refreshToken);
  }

  async logout(refreshToken: string) {
    return this.authRepository.logout(refreshToken);
  }
}
