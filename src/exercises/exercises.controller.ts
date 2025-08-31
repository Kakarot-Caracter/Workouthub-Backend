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
import { Auth } from 'src/auth/decorators/auth.decorator';
import { GetUser } from 'src/auth/decorators/get-user.decorator';
import { User } from '@prisma/client';

@Auth()
@Controller('routines/:routineId/exercises')
export class ExercisesController {
  constructor(private readonly exercisesService: ExercisesService) {}

  @Post()
  create(
    @Param('routineId', ParseIntPipe) routineId: number,
    @Body() createExerciseDto: CreateExerciseDto,
    @GetUser() user: User,
  ) {
    return this.exercisesService.create(createExerciseDto, routineId, user.id);
  }

  @Get()
  findAll(
    @Param('routineId', ParseIntPipe) routineId: number,
    @GetUser() user: User,
  ) {
    return this.exercisesService.findAll(routineId, user.id);
  }

  @Get(':id')
  findOne(
    @Param('id', ParseIntPipe) id: number,
    @Param('routineId', ParseIntPipe) routineId: number,
    @GetUser() user: User,
  ) {
    return this.exercisesService.findOne(id, routineId, user.id);
  }

  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Param('routineId', ParseIntPipe) routineId: number,
    @Body() updateExerciseDto: UpdateExerciseDto,
    @GetUser() user: User,
  ) {
    return this.exercisesService.update(
      id,
      updateExerciseDto,
      routineId,
      user.id,
    );
  }

  @Delete(':id')
  remove(
    @Param('id', ParseIntPipe) id: number,
    @Param('routineId', ParseIntPipe) routineId: number,
    @GetUser() user: User,
  ) {
    return this.exercisesService.remove(id, routineId, user.id);
  }
}
