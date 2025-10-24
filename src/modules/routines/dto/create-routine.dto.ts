import { IsString, IsOptional, IsInt, IsNotEmpty } from 'class-validator';

export class CreateRoutineDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsOptional()
  description?: string;
}
