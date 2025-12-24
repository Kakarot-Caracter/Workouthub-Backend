import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseIntPipe,
  HttpStatus,
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
  async createRoutine(
    @Body() createRoutineDto: CreateRoutineDto,
    @GetUser() user: User,
  ) {
    const routine = await this.routinesService.createRoutine(
      createRoutineDto,
      user.id,
    );
    return {
      statusCode: HttpStatus.CREATED,
      message: 'Rutina creada exitosamente',
      routine,
    };
  }

  @Get()
  async findAllRoutines(@GetUser() user: User) {
    const routines = await this.routinesService.findAllRoutines(user.id);
    return {
      statusCode: HttpStatus.OK,
      message: 'Rutinas obtenidas correctamente',
      routines,
      count: routines.length,
    };
  }

  @Get(':id')
  async findOneRoutine(
    @Param('id', ParseIntPipe) id: number,
    @GetUser() user: User,
  ) {
    const routine = await this.routinesService.findOneRoutine(id, user.id);
    return {
      statusCode: HttpStatus.OK,
      message: 'Rutina obtenida correctamente',
      routine,
    };
  }

  @Patch(':id')
  async updateRoutine(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateRoutineDto: UpdateRoutineDto,
    @GetUser() user: User,
  ) {
    const routine = await this.routinesService.updateRoutine(
      id,
      updateRoutineDto,
      user.id,
    );
    return {
      statusCode: HttpStatus.OK,
      message: 'Rutina actualizada correctamente',
      routine,
    };
  }

  @Delete(':id')
  async removeRoutine(
    @Param('id', ParseIntPipe) id: number,
    @GetUser() user: User,
  ) {
    const routine = await this.routinesService.removeRoutine(id, user.id);
    return {
      statusCode: HttpStatus.OK,
      message: 'Rutina eliminada correctamente',
      routine,
    };
  }
}
