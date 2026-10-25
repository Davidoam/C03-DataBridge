import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('destinos')
export class Destino {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  ciudad!: string;

  @Column()
  pais!: string;

  @Column()
  descripcion!: string;

  @Column({ default: false })
  visitado!: boolean;
}

