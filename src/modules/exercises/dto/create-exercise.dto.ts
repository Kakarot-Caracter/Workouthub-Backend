import { IsString, IsOptional, IsInt, Min, IsNotEmpty } from 'class-validator';

export class CreateExerciseDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsInt()
  @IsOptional()
  @Min(0)
  sets?: number;

  @IsInt()
  @IsOptional()
  @Min(0)
  reps?: number;

  @IsInt()
  @IsOptional()
  @Min(0)
  weight?: number;
}
