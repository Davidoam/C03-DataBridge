import { NotFoundException } from '@nestjs/common';
import { describe, expect, it, vi } from 'vitest';
import { Sneaker } from './sneaker.entity.js';
import { SneakersService } from './sneakers.service.js';

function createService() {
  const sneaker: Sneaker = {
    id: 1,
    marca: 'Nike',
    modelo: 'Air Max 1',
    precio: 149.99,
    talla: 42,
    stock: 4,
  };
  const repository = {
    count: vi.fn(),
    create: vi.fn((data) => data),
    find: vi.fn(async () => [sneaker]),
    findOneBy: vi.fn(async () => sneaker),
    merge: vi.fn((entity, dto) => Object.assign(entity, dto)),
    remove: vi.fn(async (entity) => entity),
    save: vi.fn(async (entity) => entity),
  };
  return { service: new SneakersService(repository as never), repository, sneaker };
}

describe('SneakersService', () => {
  it('devuelve la colección ordenada por id', async () => {
    const { service, repository } = createService();

    await expect(service.findAll()).resolves.toHaveLength(1);
    expect(repository.find).toHaveBeenCalledWith({ order: { id: 'ASC' } });
  });

  it('devuelve una sneaker existente', async () => {
    const { service, repository, sneaker } = createService();

    await expect(service.findOne(1)).resolves.toEqual(sneaker);
    expect(repository.findOneBy).toHaveBeenCalledWith({ id: 1 });
  });

  it('crea una sneaker y persiste el stock', async () => {
    const { service, repository } = createService();
    const dto = { marca: 'Nike', modelo: 'Dunk', precio: 99.99, talla: 41, stock: 7 };

    await expect(service.create(dto)).resolves.toEqual(dto);
    expect(repository.create).toHaveBeenCalledWith(dto);
    expect(repository.save).toHaveBeenCalledWith(dto);
  });

  it('actualiza el precio mediante merge y save', async () => {
    const { service, repository, sneaker } = createService();

    await service.update(1, { precio: 139.99 });

    expect(repository.merge).toHaveBeenCalledWith(sneaker, { precio: 139.99 });
    expect(repository.save).toHaveBeenCalledWith(sneaker);
    expect(sneaker.precio).toBe(139.99);
  });

  it('actualiza el stock sin guardar AGOTADO como texto', async () => {
    const { service, sneaker } = createService();

    await service.update(1, { stock: 0 });

    expect(sneaker.stock).toBe(0);
    expect(typeof sneaker.stock).toBe('number');
  });

  it('elimina una sneaker existente', async () => {
    const { service, repository, sneaker } = createService();

    await expect(service.remove(1)).resolves.toEqual(sneaker);
    expect(repository.remove).toHaveBeenCalledWith(sneaker);
  });

  it('lanza 404 para una sneaker inexistente', async () => {
    const { service, repository } = createService();
    repository.findOneBy.mockResolvedValue(null);

    await expect(service.findOne(999)).rejects.toBeInstanceOf(NotFoundException);
    await expect(service.update(999, { stock: 0 })).rejects.toBeInstanceOf(NotFoundException);
    await expect(service.remove(999)).rejects.toBeInstanceOf(NotFoundException);
  });

  it('crea el seed inicial solo cuando la tabla está vacía', async () => {
    const { service, repository } = createService();
    repository.count.mockResolvedValueOnce(0);

    await service.onModuleInit();

    expect(repository.create).toHaveBeenCalledTimes(2);
    expect(repository.save).toHaveBeenCalledWith([
      { marca: 'Nike', modelo: 'Air Max 1', precio: 149.99, talla: 42, stock: 4 },
      { marca: 'Adidas', modelo: 'Forum Low', precio: 119.99, talla: 43, stock: 0 },
    ]);
  });
});

