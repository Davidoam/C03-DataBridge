import { describe, expect, it, vi } from 'vitest';
import { PlaylistsController } from './playlists.controller.js';

describe('PlaylistsController', () => {
  it('delega GET de playlist y POST de canción en el servicio', async () => {
    const service = {
      findOne: vi.fn(async (id: number) => ({ id })),
      createCancion: vi.fn(async (dto: { playlistId: number }) => ({ id: dto.playlistId })),
    };
    const controller = new PlaylistsController(service as never);

    await expect(controller.findOne(1)).resolves.toEqual({ id: 1 });
    await expect(controller.createCancion({ titulo: 'Tema', artista: 'Artista', playlistId: 1 })).resolves.toEqual({ id: 1 });
    expect(service.findOne).toHaveBeenCalledWith(1);
    expect(service.createCancion).toHaveBeenCalledWith({ titulo: 'Tema', artista: 'Artista', playlistId: 1 });
  });
});

