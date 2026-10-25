import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post } from '@nestjs/common';
import { Sneaker } from './sneaker.entity.js';
import { CreateSneakerDto } from './create-sneaker.dto.js';
import { UpdateSneakerDto } from './update-sneaker.dto.js';
import { SneakersService } from './sneakers.service.js';

@Controller('sneakers')
export class SneakersController {
  constructor(private readonly sneakersService: SneakersService) {}

  @Get()
  findAll(): Promise<Sneaker[]> {
    return this.sneakersService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number): Promise<Sneaker> {
    return this.sneakersService.findOne(id);
  }

  @Post()
  create(@Body() dto: CreateSneakerDto): Promise<Sneaker> {
    return this.sneakersService.create(dto);
  }

  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateSneakerDto,
  ): Promise<Sneaker> {
    return this.sneakersService.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number): Promise<Sneaker> {
    return this.sneakersService.remove(id);
  }
}

