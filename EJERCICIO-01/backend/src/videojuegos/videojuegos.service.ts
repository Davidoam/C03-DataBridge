import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Videojuego } from './videojuego.entity.js';

@Injectable()
export class VideojuegosService implements OnModuleInit {
  constructor(
    @InjectRepository(Videojuego)
    private readonly repository: Repository<Videojuego>,
  ) {}

  async onModuleInit(): Promise<void> {
    const total = await this.repository.count();

    if (total === 0) {
      await this.repository.save([
        {
          titulo: 'Hollow Knight',
          plataforma: 'Nintendo Switch',
          genero: 'Metroidvania',
          puntuacion: 9.4,
        },
        {
          titulo: 'Zelda: Tears of the Kingdom',
          plataforma: 'Nintendo Switch',
          genero: 'Aventura',
          puntuacion: 9.8,
        },
        {
          titulo: 'Forza Horizon 5',
          plataforma: 'Xbox',
          genero: 'Carreras',
          puntuacion: 9.1,
        },
      ]);
    }
  }

  findAll(): Promise<Videojuego[]> {
    return this.repository.find({
      order: { puntuacion: 'DESC' },
    });
  }
}
