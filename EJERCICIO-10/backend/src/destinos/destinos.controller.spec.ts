import { describe, expect, it, vi } from 'vitest';
import { DestinosController } from './destinos.controller.js';

describe('DestinosController', () => {
  it('delega GET, POST, PATCH y DELETE en el servicio', async () => {
    const service = {
      findAll: vi.fn(async () => []),
      findOne: vi.fn(async (id: number) => ({ id })),
      create: vi.fn(async (dto: { visitado: boolean }) => ({ id: 1, ...dto })),
      update: vi.fn(async (id: number, dto: { visitado?: boolean }) => ({ id, ...dto })),
      remove: vi.fn(async (id: number) => ({ id })),
    };
    const controller = new DestinosController(service as never);

    await expect(controller.findAll()).resolves.toEqual([]);
    await expect(controller.findOne(1)).resolves.toEqual({ id: 1 });
    await expect(controller.create({ ciudad: 'Tokio', pais: 'Japón', descripcion: 'Nuevo', visitado: false })).resolves.toEqual({ id: 1, ciudad: 'Tokio', pais: 'Japón', descripcion: 'Nuevo', visitado: false });
    await expect(controller.update(1, { visitado: true })).resolves.toEqual({ id: 1, visitado: true });
    await expect(controller.remove(1)).resolves.toEqual({ id: 1 });
    expect(service.findAll).toHaveBeenCalledOnce();
    expect(service.findOne).toHaveBeenCalledWith(1);
    expect(service.create).toHaveBeenCalledWith({ ciudad: 'Tokio', pais: 'Japón', descripcion: 'Nuevo', visitado: false });
    expect(service.update).toHaveBeenCalledWith(1, { visitado: true });
    expect(service.remove).toHaveBeenCalledWith(1);
  });
});

