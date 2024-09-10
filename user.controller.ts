import { Controller, Post, Body, Get, NotFoundException, Put } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { ForgetDto } from './dto/forget.dto';
import { LoginDto } from './dto/login.dto';
import { SendRequestDto,AcceptRequestDto } from './dto/connect.dto';
import { User } from './user.schema';
import { SentMessageInfo } from 'nodemailer';
import { BadRequestException } from '@nestjs/common';
import { OptionDto } from './dto/option.dto';


@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}


  @Post('create-payment-intent')
  async createPaymentIntent(@Body() body: { amount: number; currency: string }) {
    const { amount, currency } = body;
    const paymentIntent = await this.userService.createCheckoutSession(amount, currency);
    return paymentIntent;
  }


  @Post('sendsms')
  async sendSms(@Body() body: { senderId: string; receiverId: string }) {
  const { senderId, receiverId } = body;  
  return  await this.userService.sendSms(senderId, receiverId);
  
}



  @Post('/signup')
  async create(@Body() createUserDto: CreateUserDto): Promise<object> {
    return this.userService.create(createUserDto);
  }
   
  @Post('/details')
  async adddetails(@Body() optionDto:OptionDto):Promise<object>
  {
    return this.userService.addDetails(optionDto);
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
 
  @Post('/forget-password')
  async Email(@Body() forgetDto:ForgetDto): Promise<SentMessageInfo> {
    try {
      const result = await this.userService.mailTransport(forgetDto.email);
      if(result)
      {
        return { status:"success",message: 'Your password reset request was successful. Please click the following link to set a new password:' };
      }
    } catch (error) {
      
      console.error('Error sending email:', error);
      throw error;
    }
  }
}
