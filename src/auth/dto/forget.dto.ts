import { IsEmail, IsString, MinLength } from 'class-validator';

export class ForgetDto {
  @IsEmail()
  email: string;
}