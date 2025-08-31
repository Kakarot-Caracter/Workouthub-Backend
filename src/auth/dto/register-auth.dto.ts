import {
  IsEmail,
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsPositive,
  IsString,
  MinLength,
} from 'class-validator';

import { Gender, WeeklyActivity } from '@prisma/client';

export class RegisterAuthDto {
  @IsString()
  @IsNotEmpty()
  username: string;

  @IsEmail()
  email: string;

  @IsString()
  @MinLength(8, { message: 'Password must be at least 8 characters long' })
  password: string;

  @IsNumber()
  @IsPositive()
  height: number;

  @IsInt()
  @IsPositive()
  age: number;

  @IsNumber()
  @IsPositive()
  weight: number;

  @IsEnum(Gender)
  gender: Gender;

  @IsEnum(WeeklyActivity)
  weeklyActivity: WeeklyActivity;
}
