import { Injectable,InternalServerErrorException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from './user.schema';
import { CreateUserDto } from './dto/create-user.dto';
import * as nodemailer from 'nodemailer';
import { google } from 'googleapis';
import { NotFoundException } from '@nestjs/common';
import { BadRequestException } from '@nestjs/common';
import { OptionDto } from './dto/option.dto';
import { ConfigService } from '@nestjs/config';
import { send } from 'process';
import Stripe from 'stripe';

@Injectable()
export class UserService {
  private stripe: Stripe;
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>, private configService: ConfigService,
  ) {
    // Initialize Stripe with your secret key
    this.stripe = new Stripe(this.configService.get<string>('STRIPE_SECRET_KEY'), {
      apiVersion: '2024-06-20',
    });
  }


  

  // async createCharge(amount: number, currency: string, source: string, description: string) {
  //   try {
  //     return await this.stripe.charges.create({
  //       amount,
  //       currency,
  //       source,
  //       description,
  //     });
  //   } catch (error) {
  //     throw new Error(error.message);
  //   }
  // }

  async createCheckoutSession(amount: number, currency: string) {
    try {
      return await this.stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        line_items: [
          {
            price_data: {
              currency,
              product_data: {
                name: 'Rahul Thapliyal',
              },
              unit_amount: amount, // Stripe expects the amount in the smallest currency unit (e.g., cents for USD)
            },
            quantity: 1, // Adjust the quantity as needed
          },
        ],
        mode: 'payment', // Can be 'payment' for one-time payment or 'subscription' for recurring payments
        success_url: 'https://your-site.com/success', // Redirect URL after successful payment
        cancel_url: 'https://your-site.com/cancel',   // Redirect URL if payment is canceled
      });
    } catch (error) {
      throw new Error(error.message);
    }
  }
  


    // async  checkout(amount: number, currency: string) {
    //   try {
    //     const session = await this.stripe.checkout.sessions.create({
    //       payment_method_types: ["card"],
    //       mode: "payment",
    //       line_items:
    //         return {
    //           price_data: {
    //             currency: "usd",
    //             product_data: {
    //               name: storeItem.name,
    //             },
    //             unit_amount: storeItem.priceInCents,
    //           },
    //           quantity: item.quantity,
    //         }
    //       }),
    //       success_url: `${process.env.CLIENT_URL}/success.html`,
    //       cancel_url: `${process.env.CLIENT_URL}/cancel.html`,
    //     })
    //     res.json({ url: session.url })
    //   } 
    //    catch (error) {
    //     throw new Error(error.message);
    //   }}
  


   


twilio = require("twilio")( this.configService.get<string>('TWILIO_ACCOUNT_SID'),
this.configService.get<string>('TWILIO_AUTH_TOKEN'));




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


  //For adding the Details

  async addDetails(option:OptionDto):Promise<object>
  {
    
  const sender = await this.userModel.findOne({ email: option.email }).exec();
  if (!sender) {
    throw new NotFoundException(' not found');
  }
  sender.age=option.age;
  sender.Gender=option.Gender;
  sender.location=option.location;
  sender.occupation=option.occupation;
  sender.hobbies=option.hobbies;
  sender.bio=option.bio;
  sender.interests=option.interests;
  sender.height=option.height;
  sender.education=option.education;
  sender.relationshipStatus=option.relationshipStatus;
  sender.religion=option.religion;
  sender.children=option.children;
  sender.smoking=option.smoking;
  sender.drinking=option.drinking;
  sender.languages=option.languages;


  await sender.save();

  return { message: 'Friend request sent successfully' };
  }




// Find user by email and password
  async findByEmail(email: string): Promise<User | null> {
    return this.userModel.findOne({ email }).exec();
  }







////////////////////////sendSms///////////////////////////////////////////////////

async sendSms(senderId: string, receiverId: string): Promise<any> {
  const messageOptions = {
    from: this.configService.get<string>('TWILIO_PHONE_NUMBER'),
    to: this.configService.get<string>('TWILIO_TO_PHONE_NUMBER'),
    body: `${senderId} accepted the friend request of ${receiverId}`
  };

  try {
    const message = await this.twilio.messages.create(messageOptions);
    return { status: 'ok', data: message };
  } catch (err) {
    console.error('Error sending SMS:', err);
    return { status: 'error', message: err.message };
  }
}
// sendsms("Hi my name is Rahul Thapliyal");


 // Initialize Stripe in the constructor body
//  this.stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
//   apiVersion: '2022-11-15',
// });
// }





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

   const hobbiesuser1=sender.hobbies;
   const hobbiesuser2=receiver.hobbies;
   let age: number = 0;
   let hobbiecount=0
   if(hobbiesuser1.length>hobbiesuser2.length)
    age=hobbiesuser2.length;
   else
     age=hobbiesuser1.length;
     for (let i = 0; i < hobbiesuser1.length; i++) {
      // Check if a hobby from hobbiesuser1 exists in hobbiesuser2
      if (hobbiesuser2.includes(hobbiesuser1[i])) {
        hobbiecount++;
      }
    }
    hobbiecount=hobbiecount/hobbiesuser1.length;
    count=count+hobbiecount;


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
  if(sender.religion===receiver.religion)
    count++;
  var value=(count/8)*100;
  
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


  const existingRequest = receiver.friendRequests.find(
    (req) => req.senderId === sender._id.toString() && req.status === 'pending'
  );
  if (existingRequest) {
    throw new BadRequestException('Friend request already sent');
  }

  
  receiver.friendRequests.push({
    senderId: sender._id.toString(), // Store the sender's ID
    status: 'pending',
  });


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





  // For forget password
  async mailTransport(email: string): Promise<any> {
    try {
      const oAuth2Client = new google.auth.OAuth2(
        this.configService.get<string>('GOOGLE_CLIENT_ID'),
        this.configService.get<string>('GOOGLE_CLIENT_SECRET'),
        this.configService.get<string>('GOOGLE_REDIRECT_URI')
      );
  
      oAuth2Client.setCredentials({ refresh_token: this.configService.get<string>('GOOGLE_REFRESH_TOKEN') });
      const accessToken = await oAuth2Client.getAccessToken();
  
      const transport = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          type: 'OAuth2',
          user: 'rahulthapliyal888@gmail.com',
          clientId: this.configService.get<string>('GOOGLE_CLIENT_ID'),
          clientSecret: this.configService.get<string>('GOOGLE_CLIENT_SECRET'),
          refreshToken: this.configService.get<string>('GOOGLE_REFRESH_TOKEN'),
          accessToken: accessToken.token,
        },
      });
  
      const mailOptions = {
        from: 'Rahul Thapliyal <rahulthapliyal888@gmail.com>',
        to: email,
        subject: 'Hello from gmail using API',
        text: 'Hello from gmail email using API',
        html: `<h1>Aapka Password hai 1234 </h1>`,
      };
  
      const result = await transport.sendMail(mailOptions);
      return result;
    } catch (error) {
      console.error('Error sending email:', error);
      throw new InternalServerErrorException('Failed to send email');
    }
  }
}




// This is your test secret API key.
// const stripe = require('stripe')('sk_test_51Px44B07deYmZTjyOw5jt1PpK8kN6BY0Ej4WfXxN0kMC3hQUl9oS4xMVRgs2GNiBJQ5kJbTXII1tVSOpEafDW8KW00wsL2lXo7');
// const express = require('express');
// const app = express();
// app.use(express.static('public'));

// const YOUR_DOMAIN = 'http://localhost:4242';

// app.post('/create-checkout-session', async (req, res) => {
//   const session = await stripe.checkout.sessions.create({
//     line_items: [
//       {
//         // Provide the exact Price ID (for example, pr_1234) of the product you want to sell
//         price: '{{PRICE_ID}}',
//         quantity: 1,
//       },
//     ],
//     mode: 'payment',
//     success_url: `${YOUR_DOMAIN}/success.html`,
//     cancel_url: `${YOUR_DOMAIN}/cancel.html`,
//   });

//   res.redirect(303, session.url);
// });

// app.listen(4242, () => console.log('Running on port 4242'));