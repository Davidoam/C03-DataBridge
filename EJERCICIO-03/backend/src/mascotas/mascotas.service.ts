import { Injectable, NotFoundException, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Mascota } from './mascota.entity.js';

@Injectable()
export class MascotasService implements OnModuleInit {
  constructor(
    @InjectRepository(Mascota)
    private readonly repository: Repository<Mascota>,
  ) {}

  async onModuleInit(): Promise<void> {
    const total = await this.repository.count();

    if (total === 0) {
      await this.repository.save({
        nombre: 'Nala',
        raza: 'Golden Retriever',
        edad: 4,
        ciudad: 'Zaragoza',
        nivelEnergia: 'ALTO',
      });
    }
  }

  async findOne(id: number): Promise<Mascota> {
    const mascota = await this.repository.findOneBy({ id });

    if (!mascota) {
      throw new NotFoundException('Mascota no encontrada');
    }

    return mascota;
  }
}
