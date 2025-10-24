import {
  IsEmail,
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsOptional,
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
  @IsOptional()
  height: number;

  @IsInt()
  @IsPositive()
  @IsOptional()
  age: number;

  @IsNumber()
  @IsPositive()
  @IsOptional()
  weight: number;

  @IsEnum(Gender)
  @IsOptional()
  gender: Gender;

  @IsEnum(WeeklyActivity)
  @IsOptional()
  weeklyActivity: WeeklyActivity;
}
