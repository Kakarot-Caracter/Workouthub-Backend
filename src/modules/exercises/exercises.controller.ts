import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseIntPipe,
} from '@nestjs/common';
import { ExercisesService } from './exercises.service';
import { CreateExerciseDto } from './dto/create-exercise.dto';
import { UpdateExerciseDto } from './dto/update-exercise.dto';

import { Auth } from 'src/common/decorators/auth.decorator';

@Auth()
@Controller('routines/:routineId/exercises')
export class ExercisesController {
  constructor(private readonly exercisesService: ExercisesService) {}

  @Post()
  createExercise(
    @Param('routineId', ParseIntPipe) routineId: number,
    @Body() createExerciseDto: CreateExerciseDto,
  ) {
    return this.exercisesService.createExercise(createExerciseDto, routineId);
  }

  @Get()
  findAllExercises(@Param('routineId', ParseIntPipe) routineId: number) {
    return this.exercisesService.findAllExercises(routineId);
  }

  @Get(':id')
  findOneExercise(
    @Param('id', ParseIntPipe) id: number,
    @Param('routineId', ParseIntPipe) routineId: number,
  ) {
    return this.exercisesService.findOneExercise(id, routineId);
  }

  @Patch(':id')
  updateExercise(
    @Param('id', ParseIntPipe) id: number,
    @Param('routineId', ParseIntPipe) routineId: number,
    @Body() updateExerciseDto: UpdateExerciseDto,
  ) {
    return this.exercisesService.updateExercise(id, updateExerciseDto);
  }

  @Delete(':id')
  removeExercise(
    @Param('id', ParseIntPipe) id: number,
    @Param('routineId', ParseIntPipe) routineId: number,
  ) {
    return this.exercisesService.removeExercise(id, routineId);
  }
}
