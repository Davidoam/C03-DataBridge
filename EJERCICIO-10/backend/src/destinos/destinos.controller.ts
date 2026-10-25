import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post } from '@nestjs/common';
import { CreateDestinoDto } from './create-destino.dto.js';
import { Destino } from './destino.entity.js';
import { DestinosService } from './destinos.service.js';
import { UpdateDestinoDto } from './update-destino.dto.js';

@Controller('destinos')
export class DestinosController {
  constructor(private readonly destinosService: DestinosService) {}

  @Get()
  findAll(): Promise<Destino[]> {
    return this.destinosService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number): Promise<Destino> {
    return this.destinosService.findOne(id);
  }

  @Post()
  create(@Body() dto: CreateDestinoDto): Promise<Destino> {
    return this.destinosService.create(dto);
  }

  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateDestinoDto,
  ): Promise<Destino> {
    return this.destinosService.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number): Promise<Destino> {
    return this.destinosService.remove(id);
  }
}

