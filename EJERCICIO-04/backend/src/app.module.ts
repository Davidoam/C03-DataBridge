import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RestaurantesModule } from './restaurantes/restaurantes.module.js';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST ?? 'localhost',
      port: Number(process.env.DB_PORT ?? 5432),
      username: process.env.DB_USERNAME ?? 'postgres',
      password: process.env.DB_PASSWORD ?? '',
      database: process.env.DB_DATABASE ?? 'databridge_e04',
      autoLoadEntities: true,
      synchronize: true,
    }),
    RestaurantesModule,
  ],
})
export class AppModule {}
