import { PeliculasService } from './peliculas.service.js';

describe('PeliculasService', () => {
  it('devuelve las películas ordenadas por puntuación', async () => {
    const peliculas = [
      { id: 1, titulo: 'Interstellar', puntuacion: 9.2 },
      { id: 2, titulo: 'Coco', puntuacion: 8.8 },
    ];
    const repository = {
      count: vi.fn().mockResolvedValue(2),
      find: vi.fn().mockResolvedValue(peliculas),
      save: vi.fn(),
    };
    const service = new PeliculasService(repository as never);

    await expect(service.findAll()).resolves.toEqual(peliculas);
    expect(repository.find).toHaveBeenCalledWith({
      order: { puntuacion: 'DESC' },
    });
  });

  it('siembra datos solo cuando la tabla está vacía', async () => {
    const repository = {
      count: vi.fn().mockResolvedValue(0),
      find: vi.fn(),
      save: vi.fn().mockResolvedValue([]),
    };
    const service = new PeliculasService(repository as never);

    await service.onModuleInit();

    expect(repository.save).toHaveBeenCalledWith([
      expect.objectContaining({ titulo: 'Interstellar', favorita: true }),
      expect.objectContaining({ titulo: 'Coco', favorita: false }),
    ]);
  });
});
