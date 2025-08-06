import { Budget } from 'src/budget/entities/budget.entity';
import { TripDay } from 'src/trip/entities/trip-day.entity';
import { User } from 'src/users/entities/users.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  OneToMany,
} from 'typeorm';
@Entity('trips')
export class Trip {
  @PrimaryGeneratedColumn()
  tripid: number;

  @Column()
  nametrip: string;

  @Column()
  locationtrip: string;

  @Column({ nullable: false })
  usercreateid: number;

  @Column()
  note: string;

  @Column({ type: 'timestamp', nullable: true })
  starttrip: Date;

  @Column({ type: 'timestamp', nullable: true })
  endtrip: Date;

  @ManyToOne(() => User, (user) => user.trips, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'usercreateid' })
  user: User;

  @OneToMany(() => TripDay, (tripday) => tripday.trip)
  tripday: TripDay[];

  @OneToMany(() => Budget, (budget) => budget.trip)
  budget: Budget[];
}
