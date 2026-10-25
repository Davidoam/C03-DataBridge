import { NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import type { DeepPartial } from 'typeorm';
import { Libro } from './libro.entity.js';
import { UpdateLibroDto } from './update-libro.dto.js';

export class LibrosService {
  constructor(
    @InjectRepository(Libro)
    private readonly repository: Repository<Libro>,
  ) {}

  async onModuleInit(): Promise<void> {
    if ((await this.repository.count()) === 0) {
      await this.repository.save([
        this.repository.create({
          titulo: '1984',
          autor: 'George Orwell',
          genero: 'Distopía',
          leido: false,
        }),
        this.repository.create({
          titulo: 'Dune',
          autor: 'Frank Herbert',
          genero: 'Ciencia ficción',
          leido: true,
        }),
      ]);
    }
  }

  findAll(): Promise<Libro[]> {
    return this.repository.find({ order: { id: 'ASC' } });
  }

  async remove(id: number): Promise<Libro> {
    const libro = await this.findById(id);
    return this.repository.remove(libro);
  }

  async markAsRead(id: number, dto: UpdateLibroDto): Promise<Libro> {
    const libro = await this.findById(id);
    this.repository.merge(libro, dto as unknown as DeepPartial<Libro>);
    return this.repository.save(libro);
  }

  private async findById(id: number): Promise<Libro> {
    const libro = await this.repository.findOneBy({ id });

    if (!libro) {
      throw new NotFoundException('Libro no encontrado');
    }

    return libro;
  }
}

