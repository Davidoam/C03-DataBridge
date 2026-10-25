import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Playlist } from './playlist.entity.js';

@Entity('canciones')
export class Cancion {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  titulo!: string;

  @Column()
  artista!: string;

  @ManyToOne(() => Playlist, (playlist) => playlist.canciones, { nullable: false })
  @JoinColumn({ name: 'playlist_id' })
  playlist!: Playlist;
}

