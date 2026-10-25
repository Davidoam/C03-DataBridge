import { Controller, Param, ParseIntPipe, Patch, Body } from '@nestjs/common';
import { Viaje } from './viaje.entity.js';
import { UpdateViajeDto } from './update-viaje.dto.js';
import { ViajesService } from './viajes.service.js';

@Controller('viajes')
export class ViajesController {
  constructor(private readonly viajesService: ViajesService) {}

  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateViajeDto,
  ): Promise<Viaje> {
    return this.viajesService.update(id, dto);
  }
}

