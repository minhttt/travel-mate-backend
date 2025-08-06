import { TripDay } from 'src/trip/entities/trip-day.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
@Entity('tripplace')
export class TripPlace {
  @PrimaryGeneratedColumn()
  tripplaceid: number;

  @Column()
  tripdayid: number;

  @Column()
  placeid: string;

  @Column({ default: 0 })
  orderindex: number;

  @Column()
  placename: string;

  @Column()
  placeimg: string;

  @ManyToOne(() => TripDay, (tripday) => tripday.tripplace, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'tripdayid' })
  tripday: TripDay;
}
