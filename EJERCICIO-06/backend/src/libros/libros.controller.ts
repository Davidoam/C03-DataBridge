import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch } from '@nestjs/common';
import { Libro } from './libro.entity.js';
import { UpdateLibroDto } from './update-libro.dto.js';
import { LibrosService } from './libros.service.js';

@Controller('libros')
export class LibrosController {
  constructor(private readonly librosService: LibrosService) {}

  @Get()
  findAll(): Promise<Libro[]> {
    return this.librosService.findAll();
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number): Promise<Libro> {
    return this.librosService.remove(id);
  }

  @Patch(':id')
  markAsRead(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateLibroDto,
  ): Promise<Libro> {
    return this.librosService.markAsRead(id, dto);
  }
}

