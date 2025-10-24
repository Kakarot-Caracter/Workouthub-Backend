import { Gender, WeeklyActivity } from '@prisma/client';
import {
  IsEmail,
  IsEnum,
  IsInt,
  IsNumber,
  IsOptional,
  IsString,
  Min,
  MinLength,
} from 'class-validator';

export class CreateUserDto {
  @IsString()
  username: string;

  @IsEmail()
  email: string;

  @IsString()
  @MinLength(6)
  password: string;

  @IsNumber()
  @Min(0)
  @IsOptional()
  height?: number;

  @IsInt()
  @Min(0)
  @IsOptional()
  age?: number;

  @IsNumber()
  @Min(0)
  @IsOptional()
  weight?: number;

  @IsEnum(Gender)
  @IsOptional()
  gender?: Gender;

  @IsEnum(WeeklyActivity)
  @IsOptional()
  weeklyActivity?: WeeklyActivity;
}
