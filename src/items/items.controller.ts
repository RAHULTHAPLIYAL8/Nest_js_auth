import { Controller, Get, Post, Body, Req, Res } from '@nestjs/common';
import { CreateItemDto } from './dto/create-item.dto';
import { Request, Response } from 'express';

import { Controller, Get, Post, Body } from '@nestjs/common';
import { UserService } from './user.service';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  async createUser(@Body() createUserDto: { name: string; email: string; password: string }) {
    return this.userService.createUser(createUserDto.name, createUserDto.email, createUserDto.password);
  }

  @Get()
  async findAllUsers() {
    return this.userService.findAllUsers();
  }
}
