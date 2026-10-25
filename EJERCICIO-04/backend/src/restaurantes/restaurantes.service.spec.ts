import { CreateRestauranteDto } from './create-restaurante.dto.js';
import { RestaurantesService } from './restaurantes.service.js';

describe('RestaurantesService', () => {
  it('crea y guarda un restaurante recibido por DTO', async () => {
    const dto: CreateRestauranteDto = {
      nombre: 'La Trattoria',
      tipo: 'Italiano',
      ciudad: 'Zaragoza',
      puntuacion: 9,
      precioMedio: 25,
    };
    const entity = { id: 1, ...dto };
    const repository = {
      create: vi.fn().mockReturnValue(entity),
      save: vi.fn().mockResolvedValue(entity),
    };
    const service = new RestaurantesService(repository as never);

    await expect(service.create(dto)).resolves.toEqual(entity);
    expect(repository.create).toHaveBeenCalledWith(dto);
    expect(repository.save).toHaveBeenCalledWith(entity);
  });
});
