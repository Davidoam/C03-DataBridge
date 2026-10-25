import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MascotasController } from './mascotas.controller.js';
import { Mascota } from './mascota.entity.js';
import { MascotasService } from './mascotas.service.js';

@Module({
  imports: [TypeOrmModule.forFeature([Mascota])],
  controllers: [MascotasController],
  providers: [MascotasService],
})
export class MascotasModule {}
