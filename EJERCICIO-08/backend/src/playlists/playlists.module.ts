import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Cancion } from './cancion.entity.js';
import { Playlist } from './playlist.entity.js';
import { PlaylistsController } from './playlists.controller.js';
import { PlaylistsService } from './playlists.service.js';

@Module({
  imports: [TypeOrmModule.forFeature([Playlist, Cancion])],
  controllers: [PlaylistsController],
  providers: [PlaylistsService],
})
export class PlaylistsModule {}

