import { TripDay } from 'src/trip/entities/trip-day.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
@Entity('tripnote')
export class TripNote {
  @PrimaryGeneratedColumn()
  tripnoteid: number;

  @Column()
  tripdayid: number;

  @Column()
  content: string;

  @Column({ default: 0 })
  orderindex: number;

  @ManyToOne(() => TripDay, (tripday) => tripday.tripnote, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'tripdayid' })
  tripday: TripDay;
}
