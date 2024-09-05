import { Controller, Post, Body, Get, NotFoundException, Put } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { ForgetDto } from './dto/forget.dto';
import { LoginDto } from './dto/login.dto';
import { User } from './user.schema';


@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  async create(@Body() createUserDto: CreateUserDto): Promise<User> {
    return this.userService.create(createUserDto);
  }
   
  @Get()
  async findAll(): Promise<User[]> {
    return this.userService.findAll();
  }

  @Post('/login')
  async login(@Body() loginDto: LoginDto): Promise<{ message: string }> {
    const user = await this.userService.findByEmail(loginDto.email);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return { message: 'Login successful' };
  }
  
  @Put('/forget-password')
  async update(@Body() ForgetDto: ForgetDto): Promise<{ message: string }> {
    const user = await this.userService.updatePassword(ForgetDto.email, ForgetDto.password);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return { message: 'Update Successful' };
  }
}
