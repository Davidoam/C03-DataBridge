import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Viaje } from './viaje.entity.js';
import { ViajesController } from './viajes.controller.js';
import { ViajesService } from './viajes.service.js';

@Module({
  imports: [TypeOrmModule.forFeature([Viaje])],
  controllers: [ViajesController],
  providers: [ViajesService],
})
export class ViajesModule {}

