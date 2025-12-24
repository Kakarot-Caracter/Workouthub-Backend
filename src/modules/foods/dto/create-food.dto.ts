import { IsString, IsOptional, IsInt, IsNumber, Min } from 'class-validator';

export class CreateFoodDto {
  @IsString()
  name: string;

  @IsOptional()
  @IsInt()
  @Min(0)
  calories?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  protein?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  carbs?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  fat?: number;
}
