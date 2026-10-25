import { describe, expect, it, vi } from 'vitest';
import { EventosController } from './eventos.controller.js';

describe('EventosController', () => {
  it('delega ciudad y categoría en el servicio', async () => {
    const service = { findAll: vi.fn(async (ciudad?: string, categoria?: string) => [{ ciudad, categoria }]) };
    const controller = new EventosController(service as never);

    await expect(controller.findAll('Zaragoza', 'Tecnología')).resolves.toEqual([{ ciudad: 'Zaragoza', categoria: 'Tecnología' }]);
    expect(service.findAll).toHaveBeenCalledWith('Zaragoza', 'Tecnología');
  });
});

