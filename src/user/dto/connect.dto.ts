import { IsEmail, IsString } from 'class-validator';

export class SendRequestDto {
  
  senderId: string;
  receiverId: string;
}

export class AcceptRequestDto {
  senderId: string;
  receiverId: string;
}
