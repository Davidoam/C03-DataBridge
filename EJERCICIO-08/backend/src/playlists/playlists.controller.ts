import { Body, Controller, Get, Param, ParseIntPipe, Post } from '@nestjs/common';
import { CreateCancionDto } from './create-cancion.dto.js';
import { Playlist } from './playlist.entity.js';
import { PlaylistsService } from './playlists.service.js';

@Controller()
export class PlaylistsController {
  constructor(private readonly playlistsService: PlaylistsService) {}

  @Get('playlists/:id')
  findOne(@Param('id', ParseIntPipe) id: number): Promise<Playlist> {
    return this.playlistsService.findOne(id);
  }

  @Post('canciones')
  createCancion(@Body() dto: CreateCancionDto): Promise<Playlist> {
    return this.playlistsService.createCancion(dto);
  }
}

