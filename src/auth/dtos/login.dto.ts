import { Expose } from 'class-transformer';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class LoginDto {
  @Expose()
  @IsNotEmpty()
  @IsString()
  signedMessage: string;

  @Expose()
  @IsNotEmpty()
  @IsString()
  message: string;
  
  @Expose()
  @IsNotEmpty()
  @IsString()
  address: string;

  @Expose()
  @IsNotEmpty()
  @IsString()
  role: string;
}
