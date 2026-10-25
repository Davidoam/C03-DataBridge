import { Controller, Get } from '@nestjs/common';
import { Pelicula } from './pelicula.entity.js';
import { PeliculasService } from './peliculas.service.js';

@Controller('peliculas')
export class PeliculasController {
  constructor(private readonly peliculasService: PeliculasService) {}

  @Get()
  findAll(): Promise<Pelicula[]> {
    return this.peliculasService.findAll();
  }
}
