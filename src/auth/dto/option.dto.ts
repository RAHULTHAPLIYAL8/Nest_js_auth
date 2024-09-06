import { IsString, IsOptional } from 'class-validator';

export class OptionDto {
 

  @IsString()
  email: string;

  @IsOptional()
  @IsString()
  age?: string;

  @IsOptional()
  @IsString()
  location?: string;

  @IsOptional()
  @IsString()
  occupation?: string;

  @IsOptional()
  @IsString()
  hobbies?: string;

  @IsOptional()
  @IsString()
  bio?: string;

  @IsOptional()
  @IsString()
  interests?: string;

  @IsOptional()
  @IsString()
  height?: string;

  @IsOptional()
  @IsString()
  education?: string;

  @IsOptional()
  @IsString()
  relationshipStatus?: string;

  @IsOptional()
  @IsString()
  children?: string;

  @IsOptional()
  @IsString()
  religion?: string;

  @IsOptional()
  @IsString()
  smoking?: string;

  @IsOptional()
  @IsString()
  drinking?: string;

  @IsOptional()
  @IsString()
  languages?: string;
}
