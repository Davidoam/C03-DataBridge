import { NotFoundException } from '@nestjs/common';
import { describe, expect, it, vi } from 'vitest';
import { Libro } from './libro.entity.js';
import { LibrosService } from './libros.service.js';

function createService() {
  const libro: Libro = {
    id: 1,
    titulo: '1984',
    autor: 'George Orwell',
    genero: 'Distopía',
    leido: false,
  };
  const repository = {
    count: vi.fn(),
    create: vi.fn((data) => data),
    find: vi.fn(async () => [libro]),
    findOneBy: vi.fn(async () => libro),
    merge: vi.fn((entity, dto) => Object.assign(entity, dto)),
    remove: vi.fn(async (entity) => entity),
    save: vi.fn(async (entity) => entity),
  };
  return { service: new LibrosService(repository as never), repository, libro };
}

describe('LibrosService', () => {
  it('devuelve la colección ordenada por id', async () => {
    const { service, repository } = createService();

    await expect(service.findAll()).resolves.toHaveLength(1);
    expect(repository.find).toHaveBeenCalledWith({ order: { id: 'ASC' } });
  });

  it('elimina un libro existente mediante repository.remove', async () => {
    const { service, repository, libro } = createService();

    await expect(service.remove(1)).resolves.toEqual(libro);
    expect(repository.findOneBy).toHaveBeenCalledWith({ id: 1 });
    expect(repository.remove).toHaveBeenCalledWith(libro);
  });

  it('lanza 404 al eliminar un libro inexistente', async () => {
    const { service, repository } = createService();
    repository.findOneBy.mockResolvedValueOnce(null);

    await expect(service.remove(999)).rejects.toBeInstanceOf(NotFoundException);
    expect(repository.remove).not.toHaveBeenCalled();
  });

  it('marca un libro como leído y lo persiste', async () => {
    const { service, repository, libro } = createService();

    await service.markAsRead(1, { leido: true });

    expect(repository.merge).toHaveBeenCalledWith(libro, { leido: true });
    expect(repository.save).toHaveBeenCalledWith(libro);
    expect(libro.leido).toBe(true);
  });

  it('lanza 404 al marcar un libro inexistente', async () => {
    const { service, repository } = createService();
    repository.findOneBy.mockResolvedValueOnce(null);

    await expect(service.markAsRead(999, { leido: true })).rejects.toBeInstanceOf(NotFoundException);
    expect(repository.save).not.toHaveBeenCalled();
  });

  it('crea los dos libros iniciales solo con una tabla vacía', async () => {
    const { service, repository } = createService();
    repository.count.mockResolvedValueOnce(0);

    await service.onModuleInit();

    expect(repository.create).toHaveBeenCalledTimes(2);
    expect(repository.save).toHaveBeenCalledWith([
      { titulo: '1984', autor: 'George Orwell', genero: 'Distopía', leido: false },
      { titulo: 'Dune', autor: 'Frank Herbert', genero: 'Ciencia ficción', leido: true },
    ]);
  });
});

