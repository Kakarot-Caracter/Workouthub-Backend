import { IsString, IsOptional } from 'class-validator';

export class CreateDietDto {
  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  description?: string;
}
