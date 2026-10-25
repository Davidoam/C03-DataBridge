import { NotFoundException } from '@nestjs/common';
import { MascotasService } from './mascotas.service.js';

describe('MascotasService', () => {
  it('busca una mascota concreta por id', async () => {
    const mascota = { id: 1, nombre: 'Nala', nivelEnergia: 'ALTO' };
    const repository = {
      count: vi.fn().mockResolvedValue(1),
      findOneBy: vi.fn().mockResolvedValue(mascota),
      save: vi.fn(),
    };
    const service = new MascotasService(repository as never);

    await expect(service.findOne(1)).resolves.toEqual(mascota);
    expect(repository.findOneBy).toHaveBeenCalledWith({ id: 1 });
  });

  it('lanza 404 si la mascota no existe', async () => {
    const repository = {
      count: vi.fn(),
      findOneBy: vi.fn().mockResolvedValue(null),
      save: vi.fn(),
    };
    const service = new MascotasService(repository as never);

    await expect(service.findOne(999)).rejects.toBeInstanceOf(NotFoundException);
  });

  it('siembra Nala solo cuando la tabla está vacía', async () => {
    const repository = {
      count: vi.fn().mockResolvedValue(0),
      findOneBy: vi.fn(),
      save: vi.fn().mockResolvedValue({}),
    };
    const service = new MascotasService(repository as never);

    await service.onModuleInit();

    expect(repository.save).toHaveBeenCalledWith(
      expect.objectContaining({ nombre: 'Nala', nivelEnergia: 'ALTO' }),
    );
  });
});
