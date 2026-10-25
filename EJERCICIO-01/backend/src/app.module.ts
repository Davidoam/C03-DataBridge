// app.module.ts
// RESPONSABILIDAD:
// Configurar la aplicación raíz y la conexión general con PostgreSQL.

import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { VideojuegosModule } from './videojuegos/videojuegos.module.js';
import 'dotenv/config';

@Module({
  imports: [
    // forRoot() configura UNA conexión PostgreSQL para la aplicación.
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST ?? 'localhost',
      port: Number(process.env.DB_PORT ?? 5432),
      username: process.env.DB_USERNAME ?? 'postgres',
      password: process.env.DB_PASSWORD ?? '',
      database: process.env.DB_DATABASE ?? 'databridge_e01',
      autoLoadEntities: true,
      synchronize: true,
    }),

    // Importamos nuestro módulo funcional de videojuegos.
    VideojuegosModule,
  ],
})
export class AppModule {}
