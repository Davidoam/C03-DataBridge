import { NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import type { DeepPartial } from 'typeorm';
import { Sneaker } from './sneaker.entity.js';
import { CreateSneakerDto } from './create-sneaker.dto.js';
import { UpdateSneakerDto } from './update-sneaker.dto.js';

export class SneakersService {
  constructor(
    @InjectRepository(Sneaker)
    private readonly repository: Repository<Sneaker>,
  ) {}

  async onModuleInit(): Promise<void> {
    if ((await this.repository.count()) === 0) {
      await this.repository.save([
        this.repository.create({
          marca: 'Nike',
          modelo: 'Air Max 1',
          precio: 149.99,
          talla: 42,
          stock: 4,
        }),
        this.repository.create({
          marca: 'Adidas',
          modelo: 'Forum Low',
          precio: 119.99,
          talla: 43,
          stock: 0,
        }),
      ]);
    }
  }

  findAll(): Promise<Sneaker[]> {
    return this.repository.find({ order: { id: 'ASC' } });
  }

  async findOne(id: number): Promise<Sneaker> {
    return this.findById(id);
  }

  create(dto: CreateSneakerDto): Promise<Sneaker> {
    const sneaker = this.repository.create(dto as DeepPartial<Sneaker>);
    return this.repository.save(sneaker);
  }

  async update(id: number, dto: UpdateSneakerDto): Promise<Sneaker> {
    const sneaker = await this.findById(id);
    this.repository.merge(sneaker, dto as DeepPartial<Sneaker>);
    return this.repository.save(sneaker);
  }

  async remove(id: number): Promise<Sneaker> {
    const sneaker = await this.findById(id);
    return this.repository.remove(sneaker);
  }

  private async findById(id: number): Promise<Sneaker> {
    const sneaker = await this.repository.findOneBy({ id });

    if (!sneaker) {
      throw new NotFoundException('Sneaker no encontrada');
    }

    return sneaker;
  }
}

