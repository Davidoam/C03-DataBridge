import { RestaurantesController } from './restaurantes.controller.js';

describe('RestaurantesController', () => {
  it('delega el body en el servicio', async () => {
    const dto = {
      nombre: 'La Trattoria',
      tipo: 'Italiano',
      ciudad: 'Zaragoza',
      puntuacion: 9,
      precioMedio: 25,
    };
    const created = { id: 1, ...dto };
    const service = { create: vi.fn().mockResolvedValue(created) };
    const controller = new RestaurantesController(service as never);

    await expect(controller.create(dto)).resolves.toEqual(created);
    expect(service.create).toHaveBeenCalledWith(dto);
  });
});
