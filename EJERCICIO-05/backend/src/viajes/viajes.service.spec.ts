import { NotFoundException } from '@nestjs/common';
import { describe, expect, it, vi } from 'vitest';
import { Viaje } from './viaje.entity.js';
import { ViajesService } from './viajes.service.js';

function createService() {
  const viaje: Viaje = {
    id: 1,
    destino: 'Tokio',
    pais: 'Japón',
    estado: 'RESERVADO',
    fecha: new Date('2027-04-01T00:00:00.000Z'),
  };
  const repository = {
    count: vi.fn(),
    create: vi.fn((data) => data),
    findOneBy: vi.fn(async () => viaje),
    merge: vi.fn((entity, dto) => Object.assign(entity, dto)),
    save: vi.fn(async (entity) => entity),
  };
  return { service: new ViajesService(repository as never), repository, viaje };
}

describe('ViajesService', () => {
  it('actualiza solo el estado y conserva la fecha', async () => {
    const { service, repository, viaje } = createService();
    const result = await service.update(1, { estado: 'REALIZADO' });

    expect(repository.merge).toHaveBeenCalledWith(viaje, { estado: 'REALIZADO' });
    expect(repository.save).toHaveBeenCalledWith(viaje);
    expect(result.estado).toBe('REALIZADO');
    expect(result.fecha).toEqual(new Date('2027-04-01T00:00:00.000Z'));
  });

  it('actualiza solo la fecha y conserva el estado', async () => {
    const { service, viaje } = createService();
    await service.update(1, { fecha: '2027-04-10' });

    expect(viaje.fecha).toBe('2027-04-10');
    expect(viaje.estado).toBe('RESERVADO');
  });

  it('actualiza estado y fecha juntos', async () => {
    const { service, viaje } = createService();
    await service.update(1, { estado: 'RESERVADO', fecha: '2027-04-10' });

    expect(viaje.estado).toBe('RESERVADO');
    expect(viaje.fecha).toBe('2027-04-10');
  });

  it('lanza 404 cuando el viaje no existe', async () => {
    const { service, repository } = createService();
    repository.findOneBy.mockResolvedValueOnce(null);

    await expect(service.update(999, {})).rejects.toBeInstanceOf(NotFoundException);
  });

  it('inserta el viaje inicial solo cuando la tabla está vacía', async () => {
    const { service, repository } = createService();
    repository.count.mockResolvedValueOnce(0);

    await service.onModuleInit();

    expect(repository.create).toHaveBeenCalledWith({
      destino: 'Tokio',
      pais: 'Japón',
      estado: 'RESERVADO',
      fecha: new Date('2027-04-01T00:00:00.000Z'),
    });
    expect(repository.save).toHaveBeenCalled();
  });
});

