import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateRestauranteDto } from './create-restaurante.dto.js';
import { Restaurante } from './restaurante.entity.js';

@Injectable()
export class RestaurantesService {
  constructor(
    @InjectRepository(Restaurante)
    private readonly repository: Repository<Restaurante>,
  ) {}

  create(dto: CreateRestauranteDto): Promise<Restaurante> {
    const restaurante = this.repository.create(dto);
    return this.repository.save(restaurante);
  }
}
