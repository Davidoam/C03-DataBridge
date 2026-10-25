import { NotFoundException } from '@nestjs/common';
import { describe, expect, it, vi } from 'vitest';
import { Cancion } from './cancion.entity.js';
import { Playlist } from './playlist.entity.js';
import { PlaylistsService } from './playlists.service.js';

function createService() {
  const playlist: Playlist = { id: 1, nombre: 'Entrenamiento', canciones: [] };
  const cancion: Cancion = { id: 1, titulo: 'Run Boy Run', artista: 'Woodkid', playlist };
  const playlistRepository = {
    count: vi.fn(),
    create: vi.fn((data) => data),
    findOne: vi.fn(async () => ({ ...playlist, canciones: [cancion] })),
    findOneBy: vi.fn(async () => playlist),
    save: vi.fn(async (entity) => ({ ...entity, id: 1 })),
  };
  const cancionRepository = {
    create: vi.fn((data) => data),
    save: vi.fn(async (entity) => ({ ...entity, id: 2 })),
  };
  return {
    service: new PlaylistsService(playlistRepository as never, cancionRepository as never),
    playlistRepository,
    cancionRepository,
    playlist,
  };
}

describe('PlaylistsService', () => {
  it('devuelve la playlist con relations canciones', async () => {
    const { service, playlistRepository } = createService();

    await expect(service.findOne(1)).resolves.toMatchObject({ nombre: 'Entrenamiento' });
    expect(playlistRepository.findOne).toHaveBeenCalledWith({
      where: { id: 1 },
      relations: { canciones: true },
    });
  });

  it('lanza 404 si la playlist no existe', async () => {
    const { service, playlistRepository } = createService();
    playlistRepository.findOne.mockResolvedValueOnce(null);

    await expect(service.findOne(999)).rejects.toBeInstanceOf(NotFoundException);
  });

  it('crea una canción asociada a la playlist y recarga la relación', async () => {
    const { service, playlistRepository, cancionRepository, playlist } = createService();

    await service.createCancion({ titulo: 'Midnight City', artista: 'M83', playlistId: 1 });

    expect(playlistRepository.findOneBy).toHaveBeenCalledWith({ id: 1 });
    expect(cancionRepository.create).toHaveBeenCalledWith({
      titulo: 'Midnight City',
      artista: 'M83',
      playlist,
    });
    expect(cancionRepository.save).toHaveBeenCalledWith({
      titulo: 'Midnight City',
      artista: 'M83',
      playlist,
    });
    expect(playlistRepository.findOne).toHaveBeenCalledWith({
      where: { id: 1 },
      relations: { canciones: true },
    });
  });

  it('lanza 404 si se crea una canción para una playlist inexistente', async () => {
    const { service, playlistRepository, cancionRepository } = createService();
    playlistRepository.findOneBy.mockResolvedValueOnce(null);

    await expect(service.createCancion({ titulo: 'Tema', artista: 'Artista', playlistId: 999 })).rejects.toBeInstanceOf(NotFoundException);
    expect(cancionRepository.save).not.toHaveBeenCalled();
  });

  it('crea la playlist y la canción inicial solo cuando no hay playlists', async () => {
    const { service, playlistRepository, cancionRepository } = createService();
    playlistRepository.count.mockResolvedValueOnce(0);

    await service.onModuleInit();

    expect(playlistRepository.create).toHaveBeenCalledWith({ nombre: 'Entrenamiento' });
    expect(playlistRepository.save).toHaveBeenCalled();
    expect(cancionRepository.create).toHaveBeenCalledWith({
      titulo: 'Run Boy Run',
      artista: 'Woodkid',
      playlist: { nombre: 'Entrenamiento', id: 1 },
    });
    expect(cancionRepository.save).toHaveBeenCalled();
  });
});

