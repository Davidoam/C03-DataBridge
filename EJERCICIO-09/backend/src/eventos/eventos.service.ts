import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import type { FindOptionsWhere } from 'typeorm';
import { Evento } from './evento.entity.js';

export class EventosService {
  constructor(
    @InjectRepository(Evento)
    private readonly repository: Repository<Evento>,
  ) {}

  async onModuleInit(): Promise<void> {
    if ((await this.repository.count()) === 0) {
      await this.repository.save([
        this.repository.create({
          nombre: 'Tech Meetup',
          ciudad: 'Zaragoza',
          categoria: 'Tecnología',
          fecha: '2027-03-12',
        }),
        this.repository.create({
          nombre: 'Jazz Night',
          ciudad: 'Zaragoza',
          categoria: 'Música',
          fecha: '2027-04-05',
        }),
        this.repository.create({
          nombre: 'Design Conf',
          ciudad: 'Madrid',
          categoria: 'Tecnología',
          fecha: '2027-05-20',
        }),
      ]);
    }
  }

  findAll(ciudad?: string, categoria?: string): Promise<Evento[]> {
    const where: FindOptionsWhere<Evento> = {};
    const ciudadLimpia = ciudad?.trim();
    const categoriaLimpia = categoria?.trim();

    if (ciudadLimpia) {
      where.ciudad = ciudadLimpia;
    }

    if (categoriaLimpia) {
      where.categoria = categoriaLimpia;
    }

    return this.repository.find({
      where,
      order: { fecha: 'ASC' },
    });
  }
}

