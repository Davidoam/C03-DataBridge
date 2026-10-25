import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Videojuego } from './videojuego.entity.js';
import { VideojuegosService } from './videojuegos.service.js';

describe('VideojuegosService', () => {
  let service: VideojuegosService;
  let repository: {
    count: ReturnType<typeof vi.fn>;
    save: ReturnType<typeof vi.fn>;
    find: ReturnType<typeof vi.fn>;
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        VideojuegosService,
        {
          provide: getRepositoryToken(Videojuego),
          useValue: {
            count: vi.fn(),
            save: vi.fn(),
            find: vi.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<VideojuegosService>(VideojuegosService);
    repository = module.get(getRepositoryToken(Videojuego));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('consulta la colección ordenada por puntuación', async () => {
    const videojuegos = [{ id: 1, genero: 'Aventura' }];
    vi.mocked(repository.find).mockResolvedValue(videojuegos);

    await expect(service.findAll()).resolves.toEqual(videojuegos);
    expect(repository.find).toHaveBeenCalledWith({
      order: { puntuacion: 'DESC' },
    });
  });
});
