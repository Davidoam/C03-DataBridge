import { describe, expect, it, vi } from 'vitest';
import { ViajesController } from './viajes.controller.js';

describe('ViajesController', () => {
  it('delega la actualización en el servicio', async () => {
    const expected = { id: 1, estado: 'REALIZADO' };
    const service = { update: vi.fn(async () => expected) };
    const controller = new ViajesController(service as never);

    await expect(controller.update(1, { estado: 'REALIZADO' })).resolves.toEqual(expected);
    expect(service.update).toHaveBeenCalledWith(1, { estado: 'REALIZADO' });
  });
});

