import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Destino } from './destino.entity.js';
import { DestinosController } from './destinos.controller.js';
import { DestinosService } from './destinos.service.js';

@Module({
  imports: [TypeOrmModule.forFeature([Destino])],
  controllers: [DestinosController],
  providers: [DestinosService],
})
export class DestinosModule {}

