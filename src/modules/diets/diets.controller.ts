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
import { DietService } from './diets.service';
import { CreateDietDto } from './dto/create-diet.dto';
import { UpdateDietDto } from './dto/update-diet.dto';
import { Auth } from 'src/common/decorators/auth.decorator';
import { GetUser } from 'src/common/decorators/get-user.decorator';
import type { User } from '@prisma/client';

@Auth()
@Controller('diets')
export class DietController {
  constructor(private readonly dietService: DietService) {}

  @Post()
  async create(@Body() createDietDto: CreateDietDto, @GetUser() user: User) {
    const diet = await this.dietService.createDiet(user.id, createDietDto);

    return {
      statusCode: HttpStatus.CREATED,
      message: 'Dieta creada exitosamente',
      diet,
    };
  }

  @Get()
  async findAll(@GetUser() user: User) {
    const diets = await this.dietService.findAllDiets(user.id);

    return {
      statusCode: HttpStatus.OK,
      message: 'Dietas obtenidas correctamente',
      diets,
      count: diets.length,
    };
  }

  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number, @GetUser() user: User) {
    const diet = await this.dietService.findOneDiet(id, user.id);

    return {
      statusCode: HttpStatus.OK,
      message: 'Dieta obtenida correctamente',
      diet,
    };
  }

  @Patch(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateDietDto: UpdateDietDto,
    @GetUser() user: User,
  ) {
    const diet = await this.dietService.updateDiet(id, user.id, updateDietDto);

    return {
      statusCode: HttpStatus.OK,
      message: 'Dieta actualizada correctamente',
      diet,
    };
  }

  @Delete(':id')
  async remove(@Param('id', ParseIntPipe) id: number, @GetUser() user: User) {
    const diet = await this.dietService.removeDiet(id, user.id);

    return {
      statusCode: HttpStatus.OK,
      message: 'Dieta eliminada correctamente',
      diet,
    };
  }
}
