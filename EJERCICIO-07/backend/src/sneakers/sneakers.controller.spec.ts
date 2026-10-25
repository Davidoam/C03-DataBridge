import { describe, expect, it, vi } from 'vitest';
import { SneakersController } from './sneakers.controller.js';

describe('SneakersController', () => {
  it('delega GET, POST, PATCH y DELETE en el servicio', async () => {
    const service = {
      findAll: vi.fn(async () => []),
      findOne: vi.fn(async (id: number) => ({ id })),
      create: vi.fn(async (dto: { stock: number }) => ({ id: 1, ...dto })),
      update: vi.fn(async (id: number, dto: { stock?: number }) => ({ id, ...dto })),
      remove: vi.fn(async (id: number) => ({ id })),
    };
    const controller = new SneakersController(service as never);

    await expect(controller.findAll()).resolves.toEqual([]);
    await expect(controller.findOne(1)).resolves.toEqual({ id: 1 });
    await expect(controller.create({ marca: 'Nike', modelo: 'Dunk', precio: 99, talla: 41, stock: 3 })).resolves.toEqual({ id: 1, marca: 'Nike', modelo: 'Dunk', precio: 99, talla: 41, stock: 3 });
    await expect(controller.update(1, { stock: 0 })).resolves.toEqual({ id: 1, stock: 0 });
    await expect(controller.remove(1)).resolves.toEqual({ id: 1 });
    expect(service.findAll).toHaveBeenCalledOnce();
    expect(service.findOne).toHaveBeenCalledWith(1);
    expect(service.create).toHaveBeenCalledWith({ marca: 'Nike', modelo: 'Dunk', precio: 99, talla: 41, stock: 3 });
    expect(service.update).toHaveBeenCalledWith(1, { stock: 0 });
    expect(service.remove).toHaveBeenCalledWith(1);
  });
});

