import { Controller, Get, Param, ParseIntPipe } from '@nestjs/common';
import { Mascota } from './mascota.entity.js';
import { MascotasService } from './mascotas.service.js';

@Controller('mascotas')
export class MascotasController {
  constructor(private readonly mascotasService: MascotasService) {}

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number): Promise<Mascota> {
    return this.mascotasService.findOne(id);
  }
}
