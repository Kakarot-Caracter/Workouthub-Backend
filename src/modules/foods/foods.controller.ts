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
import { FoodService } from './foods.service';
import { CreateFoodDto } from './dto/create-food.dto';
import { UpdateFoodDto } from './dto/update-food.dto';
import { Auth } from 'src/common/decorators/auth.decorator';

@Auth()
@Controller('diets/:dietId/foods')
export class FoodController {
  constructor(private readonly foodService: FoodService) {}

  @Post()
  async create(
    @Param('dietId', ParseIntPipe) dietId: number,
    @Body() createFoodDto: CreateFoodDto,
  ) {
    const food = await this.foodService.createFood(dietId, createFoodDto);

    return {
      statusCode: HttpStatus.CREATED,
      message: 'Alimento creado exitosamente',
      food,
    };
  }

  @Get()
  async findAll(@Param('dietId', ParseIntPipe) dietId: number) {
    const foods = await this.foodService.findAllFoods(dietId);

    return {
      statusCode: HttpStatus.OK,
      message: 'Alimentos obtenidos correctamente',
      foods,
      count: foods.length,
    };
  }

  @Get(':id')
  async findOne(
    @Param('dietId', ParseIntPipe) dietId: number,
    @Param('id', ParseIntPipe) id: number,
  ) {
    const food = await this.foodService.findOneFood(id, dietId);

    return {
      statusCode: HttpStatus.OK,
      message: 'Alimento obtenido correctamente',
      food,
    };
  }

  @Patch(':id')
  async update(
    @Param('dietId', ParseIntPipe) dietId: number,
    @Param('id', ParseIntPipe) id: number,
    @Body() updateFoodDto: UpdateFoodDto,
  ) {
    const food = await this.foodService.updateFood(id, dietId, updateFoodDto);

    return {
      statusCode: HttpStatus.OK,
      message: 'Alimento actualizado correctamente',
      food,
    };
  }

  @Delete(':id')
  async remove(
    @Param('dietId', ParseIntPipe) dietId: number,
    @Param('id', ParseIntPipe) id: number,
  ) {
    const food = await this.foodService.removeFood(id, dietId);

    return {
      statusCode: HttpStatus.OK,
      message: 'Alimento eliminado correctamente',
      food,
    };
  }
}
