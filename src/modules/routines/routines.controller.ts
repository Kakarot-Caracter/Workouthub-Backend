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
import { RoutinesService } from './routines.service';
import { CreateRoutineDto } from './dto/create-routine.dto';
import { UpdateRoutineDto } from './dto/update-routine.dto';

import type { User } from '@prisma/client';
import { Auth } from 'src/common/decorators/auth.decorator';
import { GetUser } from 'src/common/decorators/get-user.decorator';

@Controller('routines')
@Auth()
export class RoutinesController {
  constructor(private readonly routinesService: RoutinesService) {}

  @Post()
  createRoutine(
    @Body() createRoutineDto: CreateRoutineDto,
    @GetUser() user: User,
  ) {
    return this.routinesService.createRoutine(createRoutineDto, user.id);
  }

  @Get()
  findAllRoutines(@GetUser() user: User) {
    return this.routinesService.findAllRoutines(user.id);
  }

  @Get(':id')
  findOneRoutine(@Param('id', ParseIntPipe) id: number, @GetUser() user: User) {
    return this.routinesService.findOneRoutine(id, user.id);
  }

  @Patch(':id')
  updateRoutine(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateRoutineDto: UpdateRoutineDto,
    @GetUser() user: User,
  ) {
    return this.routinesService.updateRoutine(id, updateRoutineDto, user.id);
  }

  @Delete(':id')
  removeRoutine(@Param('id', ParseIntPipe) id: number, @GetUser() user: User) {
    return this.routinesService.removeRoutine(id, user.id);
  }
}
