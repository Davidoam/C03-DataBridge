import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Libro } from './libro.entity.js';
import { LibrosController } from './libros.controller.js';
import { LibrosService } from './libros.service.js';

@Module({
  imports: [TypeOrmModule.forFeature([Libro])],
  controllers: [LibrosController],
  providers: [LibrosService],
})
export class LibrosModule {}

