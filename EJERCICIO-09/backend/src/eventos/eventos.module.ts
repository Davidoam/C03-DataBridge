import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Evento } from './evento.entity.js';
import { EventosController } from './eventos.controller.js';
import { EventosService } from './eventos.service.js';

@Module({
  imports: [TypeOrmModule.forFeature([Evento])],
  controllers: [EventosController],
  providers: [EventosService],
})
export class EventosModule {}

