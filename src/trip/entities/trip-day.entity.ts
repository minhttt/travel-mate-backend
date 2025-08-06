import { TripChecklist } from 'src/trip/entities/trip-checklist.entity';
import { TripNote } from 'src/trip/entities/trip-note.entity';
import { TripPlace } from 'src/trip/entities/trip-place.entity';
import { Trip } from 'src/trip/entities/trip.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  OneToMany,
} from 'typeorm';
@Entity('tripday')
export class TripDay {
  @PrimaryGeneratedColumn()
  tripdayid: number;

  @Column()
  tripid: number;

  @Column()
  daynumber: number;

  @Column({ type: 'date' })
  date: Date;

  @ManyToOne(() => Trip, (trip) => trip.tripday, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'tripid' })
  trip: Trip;

  @OneToMany(() => TripNote, (tripnote) => tripnote.tripday, {
    onDelete: 'CASCADE',
  })
  tripnote: TripNote[];

  @OneToMany(() => TripPlace, (tripplace) => tripplace.tripday, {
    onDelete: 'CASCADE',
  })
  tripplace: TripPlace[];

  @OneToMany(() => TripChecklist, (tripchecklist) => tripchecklist.tripday, {
    onDelete: 'CASCADE',
  })
  tripchecklist: TripChecklist[];
}
