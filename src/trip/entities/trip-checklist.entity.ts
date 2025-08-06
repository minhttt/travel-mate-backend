import { TripDay } from 'src/trip/entities/trip-day.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
@Entity('tripchecklist')
export class TripChecklist {
  @PrimaryGeneratedColumn()
  tripchecklistid: number;

  @Column()
  tripdayid: number;

  @Column()
  content: string;

  @Column({ default: false })
  ischecked: boolean;

  @Column({ default: 0 })
  orderindex: number;

  @ManyToOne(() => TripDay, (tripday) => tripday.tripchecklist, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'tripdayid' })
  tripday: TripDay;
}
