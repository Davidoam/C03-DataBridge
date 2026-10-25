import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('sneakers')
export class Sneaker {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  marca!: string;

  @Column()
  modelo!: string;

  @Column('numeric', { precision: 10, scale: 2 })
  precio!: number;

  @Column()
  talla!: number;

  @Column()
  stock!: number;
}

