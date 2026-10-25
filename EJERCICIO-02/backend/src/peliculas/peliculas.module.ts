import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PeliculasController } from './peliculas.controller.js';
import { Pelicula } from './pelicula.entity.js';
import { PeliculasService } from './peliculas.service.js';

@Module({
  imports: [TypeOrmModule.forFeature([Pelicula])],
  controllers: [PeliculasController],
  providers: [PeliculasService],
})
export class PeliculasModule {}
