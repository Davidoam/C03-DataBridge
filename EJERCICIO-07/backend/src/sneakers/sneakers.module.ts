import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Sneaker } from './sneaker.entity.js';
import { SneakersController } from './sneakers.controller.js';
import { SneakersService } from './sneakers.service.js';

@Module({
  imports: [TypeOrmModule.forFeature([Sneaker])],
  controllers: [SneakersController],
  providers: [SneakersService],
})
export class SneakersModule {}

