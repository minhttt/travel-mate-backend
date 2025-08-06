import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';
@Entity('place_image_random')
export class PlaceRandom {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  placeid: string;

  @Column()
  placename: string;
}
