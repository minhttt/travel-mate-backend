import { Trip } from 'src/trip/entities/trip.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';

@Entity('tripbudget')
export class Budget {
  @PrimaryGeneratedColumn()
  tripbudgetid: number;

  @Column()
  tripid: number;

  @Column()
  payfor: string;

  @Column()
  amount: number;

  @ManyToOne(() => Trip, (trip) => trip.budget, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'tripid' })
  trip: Trip;
}
