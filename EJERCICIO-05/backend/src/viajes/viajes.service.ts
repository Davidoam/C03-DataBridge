import { NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import type { DeepPartial } from 'typeorm';
import { Viaje } from './viaje.entity.js';
import { UpdateViajeDto } from './update-viaje.dto.js';

export class ViajesService {
  constructor(
    @InjectRepository(Viaje)
    private readonly repository: Repository<Viaje>,
  ) {}

  async onModuleInit(): Promise<void> {
    if ((await this.repository.count()) === 0) {
      await this.repository.save(
        this.repository.create({
          destino: 'Tokio',
          pais: 'Japón',
          estado: 'RESERVADO',
          fecha: new Date('2027-04-01T00:00:00.000Z'),
        }),
      );
    }
  }

  async update(id: number, dto: UpdateViajeDto): Promise<Viaje> {
    const viaje = await this.repository.findOneBy({ id });

    if (!viaje) {
      throw new NotFoundException('Viaje no encontrado');
    }

    this.repository.merge(viaje, dto as unknown as DeepPartial<Viaje>);
    return this.repository.save(viaje);
  }
}

