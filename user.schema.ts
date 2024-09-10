import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type UserDocument = User & Document;

@Schema()
export class User {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ required: true })
  password: string;

  @Prop({ type: [{ type: String }], default: [] })
  friends: string[]; 

  @Prop({
    type: [
      {
        senderId: { type: String, required: true },
        status: { type: String, enum: ['pending', 'accepted', 'rejected'], default: 'pending' }
      }
    ],
    default: []
  })
  friendRequests: {
    senderId: string;
    status: 'pending' | 'accepted' | 'rejected';
  }[];

  @Prop({ required: false })
  age?: string;

  @Prop({ required: false})
  Gender?:string;

  @Prop({ required: false })
  location?: string;

  @Prop({ required: false })
  occupation?: string;

  @Prop({ type: [{ type: String }], default: [] ,required :false })
  hobbies: string[]; 

  @Prop({ required: false })
  bio?: string;

  @Prop({ required: false })
  interests?: string;

  @Prop({ required: false })
  height?: string;

  @Prop({ required: false })
  education?: string;

  @Prop({ required: false })
  relationshipStatus?: string;

  @Prop({ required: false })
  children?: string;

  @Prop({ required: false })
  religion?: string;

  @Prop({ required: false })
  smoking?: string;

  @Prop({ required: false })
  drinking?: string;

  @Prop({ required: false })
  languages?: string;
}



export const UserSchema = SchemaFactory.createForClass(User);
