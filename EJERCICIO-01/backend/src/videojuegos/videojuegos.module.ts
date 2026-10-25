// videojuegos.module.ts
// RESPONSABILIDAD:
// Agrupar Entity, Controller y Service del dominio videojuegos.

import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Videojuego } from './videojuego.entity.js';
import { VideojuegosController } from './videojuegos.controller.js'; 
import { VideojuegosService } from './videojuegos.service.js';

@Module({
  // forFeature() permite utilizar Repository<Videojuego>
  // dentro de este módulo.
  imports: [TypeOrmModule.forFeature([Videojuego])],

  controllers: [VideojuegosController],
  providers: [VideojuegosService],
})
export class VideojuegosModule {}