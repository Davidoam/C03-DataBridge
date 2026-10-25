import { NotFoundException } from '@nestjs/common';
import { describe, expect, it, vi } from 'vitest';
import { Destino } from './destino.entity.js';
import { DestinosService } from './destinos.service.js';

function createService() {
  const destino: Destino = {
    id: 1,
    ciudad: 'Reikiavik',
    pais: 'Islandia',
    descripcion: 'Prioridad alta',
    visitado: false,
  };
  const repository = {
    count: vi.fn(),
    create: vi.fn((data) => data),
    find: vi.fn(async () => [destino]),
    findOneBy: vi.fn(async () => destino),
    merge: vi.fn((entity, dto) => Object.assign(entity, dto)),
    remove: vi.fn(async (entity) => entity),
    save: vi.fn(async (entity) => entity),
  };
  return { service: new DestinosService(repository as never), repository, destino };
}

describe('DestinosService', () => {
  it('devuelve la colección ordenada por id', async () => {
    const { service, repository } = createService();

    await expect(service.findAll()).resolves.toHaveLength(1);
    expect(repository.find).toHaveBeenCalledWith({ order: { id: 'ASC' } });
  });

  it('devuelve un destino existente', async () => {
    const { service, repository, destino } = createService();

    await expect(service.findOne(1)).resolves.toEqual(destino);
    expect(repository.findOneBy).toHaveBeenCalledWith({ id: 1 });
  });

  it('crea un destino y persiste visitado', async () => {
    const { service, repository } = createService();
    const dto = { ciudad: 'Tokio', pais: 'Japón', descripcion: 'Nuevo destino', visitado: false };

    await expect(service.create(dto)).resolves.toEqual(dto);
    expect(repository.create).toHaveBeenCalledWith(dto);
    expect(repository.save).toHaveBeenCalledWith(dto);
  });

  it('actualiza la descripción mediante merge y save', async () => {
    const { service, repository, destino } = createService();

    await service.update(1, { descripcion: 'Destino actualizado' });

    expect(repository.merge).toHaveBeenCalledWith(destino, { descripcion: 'Destino actualizado' });
    expect(repository.save).toHaveBeenCalledWith(destino);
    expect(destino.descripcion).toBe('Destino actualizado');
  });

  it('actualiza visitado como booleano persistente', async () => {
    const { service, destino } = createService();

    await service.update(1, { visitado: true });

    expect(destino.visitado).toBe(true);
    expect(typeof destino.visitado).toBe('boolean');
  });

  it('elimina un destino existente', async () => {
    const { service, repository, destino } = createService();

    await expect(service.remove(1)).resolves.toEqual(destino);
    expect(repository.remove).toHaveBeenCalledWith(destino);
  });

  it('lanza 404 para un destino inexistente', async () => {
    const { service, repository } = createService();
    repository.findOneBy.mockResolvedValue(null);

    await expect(service.findOne(999)).rejects.toBeInstanceOf(NotFoundException);
    await expect(service.update(999, { visitado: true })).rejects.toBeInstanceOf(NotFoundException);
    await expect(service.remove(999)).rejects.toBeInstanceOf(NotFoundException);
  });

  it('crea el seed inicial solo cuando la tabla está vacía', async () => {
    const { service, repository } = createService();
    repository.count.mockResolvedValueOnce(0);

    await service.onModuleInit();

    expect(repository.create).toHaveBeenCalledTimes(2);
    expect(repository.save).toHaveBeenCalledWith([
      { ciudad: 'Reikiavik', pais: 'Islandia', descripcion: 'Prioridad alta', visitado: false },
      { ciudad: 'Lisboa', pais: 'Portugal', descripcion: 'Escapada urbana', visitado: true },
    ]);
  });
});

