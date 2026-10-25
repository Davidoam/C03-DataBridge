import { describe, expect, it, vi } from 'vitest';
import { LibrosController } from './libros.controller.js';

describe('LibrosController', () => {
  it('delega GET, DELETE y PATCH en el servicio', async () => {
    const service = {
      findAll: vi.fn(async () => []),
      remove: vi.fn(async (id: number) => ({ id })),
      markAsRead: vi.fn(async (id: number, dto: { leido?: boolean }) => ({ id, ...dto })),
    };
    const controller = new LibrosController(service as never);

    await expect(controller.findAll()).resolves.toEqual([]);
    await expect(controller.remove(1)).resolves.toEqual({ id: 1 });
    await expect(controller.markAsRead(2, { leido: true })).resolves.toEqual({ id: 2, leido: true });
    expect(service.findAll).toHaveBeenCalledOnce();
    expect(service.remove).toHaveBeenCalledWith(1);
    expect(service.markAsRead).toHaveBeenCalledWith(2, { leido: true });
  });
});

