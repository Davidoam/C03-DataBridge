import { NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Cancion } from './cancion.entity.js';
import { CreateCancionDto } from './create-cancion.dto.js';
import { Playlist } from './playlist.entity.js';

export class PlaylistsService {
  constructor(
    @InjectRepository(Playlist)
    private readonly playlistRepository: Repository<Playlist>,
    @InjectRepository(Cancion)
    private readonly cancionRepository: Repository<Cancion>,
  ) {}

  async onModuleInit(): Promise<void> {
    if ((await this.playlistRepository.count()) === 0) {
      const playlist = await this.playlistRepository.save(
        this.playlistRepository.create({ nombre: 'Entrenamiento' }),
      );
      await this.cancionRepository.save(
        this.cancionRepository.create({
          titulo: 'Run Boy Run',
          artista: 'Woodkid',
          playlist,
        }),
      );
    }
  }

  async findOne(id: number): Promise<Playlist> {
    const playlist = await this.playlistRepository.findOne({
      where: { id },
      relations: { canciones: true },
    });

    if (!playlist) {
      throw new NotFoundException('Playlist no encontrada');
    }

    return playlist;
  }

  async createCancion(dto: CreateCancionDto): Promise<Playlist> {
    const playlist = await this.playlistRepository.findOneBy({ id: dto.playlistId });

    if (!playlist) {
      throw new NotFoundException('Playlist no encontrada');
    }

    const cancion = this.cancionRepository.create({
      titulo: dto.titulo,
      artista: dto.artista,
      playlist,
    });
    await this.cancionRepository.save(cancion);

    return this.findOne(playlist.id);
  }
}

