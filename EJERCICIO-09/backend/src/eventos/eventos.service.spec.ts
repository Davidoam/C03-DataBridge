import { describe, expect, it, vi } from 'vitest';
import { Evento } from './evento.entity.js';
import { EventosService } from './eventos.service.js';

function createService() {
  const repository = {
    count: vi.fn(),
    create: vi.fn((data) => data),
    find: vi.fn(async () => [] as Evento[]),
    save: vi.fn(async (entities) => entities),
  };
  return { service: new EventosService(repository as never), repository };
}

describe('EventosService', () => {
  it('consulta todos los eventos sin filtros', async () => {
    const { service, repository } = createService();

    await service.findAll();

    expect(repository.find).toHaveBeenCalledWith({ where: {}, order: { fecha: 'ASC' } });
  });

  it('filtra solo por ciudad', async () => {
    const { service, repository } = createService();

    await service.findAll(' Zaragoza ');

    expect(repository.find).toHaveBeenCalledWith({ where: { ciudad: 'Zaragoza' }, order: { fecha: 'ASC' } });
  });

  it('filtra solo por categoría', async () => {
    const { service, repository } = createService();

    await service.findAll(undefined, 'Tecnología');

    expect(repository.find).toHaveBeenCalledWith({ where: { categoria: 'Tecnología' }, order: { fecha: 'ASC' } });
  });

  it('combina ciudad y categoría con AND', async () => {
    const { service, repository } = createService();

    await service.findAll('Zaragoza', 'Tecnología');

    expect(repository.find).toHaveBeenCalledWith({
      where: { ciudad: 'Zaragoza', categoria: 'Tecnología' },
      order: { fecha: 'ASC' },
    });
  });

  it('ignora filtros vacíos y permite resultado vacío', async () => {
    const { service, repository } = createService();

    repository.find.mockResolvedValueOnce([]);
    await expect(service.findAll('  ', '  ')).resolves.toEqual([]);
    expect(repository.find).toHaveBeenCalledWith({ where: {}, order: { fecha: 'ASC' } });
  });

  it('crea el seed inicial solo cuando la tabla está vacía', async () => {
    const { service, repository } = createService();
    repository.count.mockResolvedValueOnce(0);

    await service.onModuleInit();

    expect(repository.create).toHaveBeenCalledTimes(3);
    expect(repository.save).toHaveBeenCalledWith([
      { nombre: 'Tech Meetup', ciudad: 'Zaragoza', categoria: 'Tecnología', fecha: '2027-03-12' },
      { nombre: 'Jazz Night', ciudad: 'Zaragoza', categoria: 'Música', fecha: '2027-04-05' },
      { nombre: 'Design Conf', ciudad: 'Madrid', categoria: 'Tecnología', fecha: '2027-05-20' },
    ]);
  });
});

