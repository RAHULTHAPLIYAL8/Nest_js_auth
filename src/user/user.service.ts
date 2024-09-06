import { Injectable,InternalServerErrorException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from './user.schema';
import { CreateUserDto } from './dto/create-user.dto';
import * as nodemailer from 'nodemailer';
import { google } from 'googleapis';
import { NotFoundException } from '@nestjs/common';
import { BadRequestException } from '@nestjs/common';

@Injectable()
export class UserService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}
// Credentials for API



//Private Request

// For Creating a User
  async create(createUserDto: CreateUserDto): Promise<object> {
    try {

      const check = await this.userModel.findOne({ email: createUserDto.email }).exec();
     console.log
      if (check) {
          return { status: "error", message: "Email already exists" };
      }
        const createdUser = new this.userModel(createUserDto);
        const savedUser = await createdUser.save();
        return { status: "ok", value: savedUser };
    } catch (error) {
        return { status: "error", message: error.message };
    }
}

  async findAll(): Promise<User[]> {
    return this.userModel.find().exec();
  }




// Find user by email and password
  async findByEmail(email: string): Promise<User | null> {
    return this.userModel.findOne({ email }).exec();
  }















// Find email and update the password
  async updatePassword(email: string, newPassword: string): Promise<User | null> {
    return this.userModel.findOneAndUpdate(
      { email }, 
      { password: newPassword }, 
      { new: true } 
    ).exec();
  }

////////////////////////////////Compare//////////////////////////////////////////////////////////



async matchrate(senderEmail: string, receiverEmail: string) {
  // Query for users by their email
  let count=0;
  
  const sender = await this.userModel.findOne({ email: senderEmail }).exec();
  console.log(sender)
  const receiver = await this.userModel.findOne({ email: receiverEmail }).exec();

  // Check if the sender and receiver exist
  if (!sender) {
    throw new NotFoundException('Sender not found');
  }
  if (!receiver) {
    throw new NotFoundException('Receiver not found');
  }
  if(sender.location===receiver.location)
    count++;
  if(sender.age===receiver.age)
    count++;
  if(sender.children===receiver.children)
    count++;
  if(sender.occupation===receiver.occupation)
    count++;
  if(sender.smoking===receiver.smoking)
    count++;
  if(sender.relationshipStatus===receiver.relationshipStatus)
    count++;
  if(sender.hobbies===receiver.hobbies)
    count++;
  if(sender.religion===receiver.religion)
    count++;
  var value=(count/10)*100;
  
  return value;

}



//////////////////////////////////////////////////////////////////////////////////////////////////////////

// ////////////////////////////Sending the request /////////////////////////////////////////////////

async sendRequest(senderEmail: string, receiverEmail: string) {
  // Query for users by their email
  const sender = await this.userModel.findOne({ email: senderEmail }).exec();
  console.log(sender)
  const receiver = await this.userModel.findOne({ email: receiverEmail }).exec();

  // Check if the sender and receiver exist
  if (!sender) {
    throw new NotFoundException('Sender not found');
  }
  if (!receiver) {
    throw new NotFoundException('Receiver not found');
  }

  // Check if a pending friend request from this sender already exists
  const existingRequest = receiver.friendRequests.find(
    (req) => req.senderId === sender._id.toString() && req.status === 'pending'
  );
  if (existingRequest) {
    throw new BadRequestException('Friend request already sent');
  }

  // Add the friend request to the receiver's friendRequests array
  receiver.friendRequests.push({
    senderId: sender._id.toString(), // Store the sender's ID
    status: 'pending',
  });

  // Save the updated receiver document
  await receiver.save();

  return { message: 'Friend request sent successfully' };
}


///////////////////////////////////////////////////////////////////////////////////////////////////////



////////////////////////////// Acceptin the Reqest//////////////////////////////////////////////////////////
async acceptRequest(senderEmail: string, receiverEmail: string) {
 
  const receiver = await this.userModel.findOne({ email: receiverEmail }).exec();
  const sender = await this.userModel.findOne({ email: senderEmail }).exec();
  if (!receiver) {
    throw new NotFoundException('Receiver not found');
  }
  if (!sender) {
    throw new NotFoundException('Sender not found');
  }
  const request = receiver.friendRequests.find(
    (req) => req.senderId === sender._id.toString() && req.status === 'pending'
  );
  if (!request) {
    throw new NotFoundException('Friend request not found or already processed');
  }
  request.status = 'accepted';
  if (!receiver.friends.includes(sender._id.toString())) {
    receiver.friends.push(sender._id.toString());
  }
  if (!sender.friends.includes(receiver._id.toString())) {
    sender.friends.push(receiver._id.toString());
  }
  await receiver.save();
  await sender.save();
  return { message: 'Friend request accepted successfully' };
}
//////////////////////////////////////////////////////////////////////////////////////////////


}