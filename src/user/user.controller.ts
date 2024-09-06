import { Controller, Post, Body, Get, NotFoundException, Put } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { ForgetDto } from './dto/forget.dto';
import { LoginDto } from './dto/login.dto';
import { SendRequestDto,AcceptRequestDto } from './dto/connect.dto';
import { User } from './user.schema';
import { SentMessageInfo } from 'nodemailer';
import { BadRequestException } from '@nestjs/common';


@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('/signup')
  async create(@Body() createUserDto: CreateUserDto): Promise<object> {
    return this.userService.create(createUserDto);
  }
   
  @Get("/all")
  async findAll(): Promise<User[]> {
    return this.userService.findAll();
  }

  @Post('/signin')
  async login(@Body() loginDto: LoginDto): Promise<object> {
    const user = await this.userService.findByEmail(loginDto.email);
    
   
    if (!user) {
      throw new NotFoundException('User not found');
    }
    if(user.password!==loginDto.password)
      {
        return {status:"error",Password:"Password does not match"}
      }
    return { status:"success",message: 'Login successful' };
  }


  @Post('/matchpair')
  async matchbair(@Body() loginDto:SendRequestDto): Promise<object> {
    const data=  await this.userService.matchrate(loginDto.senderId,loginDto.receiverId);
    if(data)
    return {status:"ok",message:data}
  }


  @Post('/sendrequest')
  async sendrequest(@Body() sendRequestDto:SendRequestDto)
  {
    return this.userService.sendRequest(sendRequestDto.senderId,sendRequestDto.receiverId)
  }

  @Post('/acceptrequest')
  async acceptrequest(@Body() sendRequestDto:SendRequestDto)
  {
    return this.userService.acceptRequest(sendRequestDto.senderId,sendRequestDto.receiverId)
  }
  


  // @Put('/update')
  // async update(@Body() ForgetDto: ForgetDto): Promise<{ message: string }> {
  //   const user = await this.userService.updatePassword(ForgetDto.email, ForgetDto.password);
  //   if (!user) {
  //     throw new NotFoundException('User not found');
  //   }
  //   return { message: 'Update Successful' };
  // }
 
}
