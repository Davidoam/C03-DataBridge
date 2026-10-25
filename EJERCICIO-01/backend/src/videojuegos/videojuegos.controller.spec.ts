import { Test, TestingModule } from '@nestjs/testing';
import { VideojuegosController } from './videojuegos.controller.js';
import { VideojuegosService } from './videojuegos.service.js';

describe('VideojuegosController', () => {
  let controller: VideojuegosController;
  let service: { findAll: ReturnType<typeof vi.fn> };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [VideojuegosController],
      providers: [
        {
          provide: VideojuegosService,
          useValue: { findAll: vi.fn() },
        },
      ],
    }).compile();

    controller = module.get<VideojuegosController>(VideojuegosController);
    service = module.get(VideojuegosService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('delega la consulta al servicio', async () => {
    const videojuegos = [{ id: 1, titulo: 'Hollow Knight' }];
    vi.mocked(service.findAll).mockResolvedValue(videojuegos as never);

    await expect(controller.findAll()).resolves.toEqual(videojuegos);
    expect(service.findAll).toHaveBeenCalledOnce();
  });
});
