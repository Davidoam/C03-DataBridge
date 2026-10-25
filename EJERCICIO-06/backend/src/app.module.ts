import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LibrosModule } from './libros/libros.module.js';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST ?? 'localhost',
      port: Number(process.env.DB_PORT ?? 5432),
      username: process.env.DB_USERNAME ?? 'postgres',
      password: process.env.DB_PASSWORD ?? '',
      database: process.env.DB_NAME ?? 'databridge_e06',
      autoLoadEntities: true,
      synchronize: true,
    }),
    LibrosModule,
  ],
})
export class AppModule {}

