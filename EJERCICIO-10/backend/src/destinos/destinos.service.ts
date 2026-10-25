import { NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import type { DeepPartial } from 'typeorm';
import { CreateDestinoDto } from './create-destino.dto.js';
import { Destino } from './destino.entity.js';
import { UpdateDestinoDto } from './update-destino.dto.js';

export class DestinosService {
  constructor(
    @InjectRepository(Destino)
    private readonly repository: Repository<Destino>,
  ) {}

  async onModuleInit(): Promise<void> {
    if ((await this.repository.count()) === 0) {
      await this.repository.save([
        this.repository.create({
          ciudad: 'Reikiavik',
          pais: 'Islandia',
          descripcion: 'Prioridad alta',
          visitado: false,
        }),
        this.repository.create({
          ciudad: 'Lisboa',
          pais: 'Portugal',
          descripcion: 'Escapada urbana',
          visitado: true,
        }),
      ]);
    }
  }

  findAll(): Promise<Destino[]> {
    return this.repository.find({ order: { id: 'ASC' } });
  }

  async findOne(id: number): Promise<Destino> {
    return this.findById(id);
  }

  create(dto: CreateDestinoDto): Promise<Destino> {
    const destino = this.repository.create(dto as DeepPartial<Destino>);
    return this.repository.save(destino);
  }

  async update(id: number, dto: UpdateDestinoDto): Promise<Destino> {
    const destino = await this.findById(id);
    this.repository.merge(destino, dto as DeepPartial<Destino>);
    return this.repository.save(destino);
  }

  async remove(id: number): Promise<Destino> {
    const destino = await this.findById(id);
    return this.repository.remove(destino);
  }

  private async findById(id: number): Promise<Destino> {
    const destino = await this.repository.findOneBy({ id });

    if (!destino) {
      throw new NotFoundException('Destino no encontrado');
    }

    return destino;
  }
}

