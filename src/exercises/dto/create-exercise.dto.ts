import { IsInt, IsNotEmpty, IsOptional, IsString, Min } from 'class-validator';

export class CreateExerciseDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsInt()
  @Min(1)
  @IsOptional()
  sets?: number;

  @IsInt()
  @Min(1)
  @IsOptional()
  reps?: number;

  @IsInt()
  @Min(1)
  @IsOptional()
  order?: number;
}
