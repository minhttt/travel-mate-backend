import { Module } from '@nestjs/common';
import { TripService } from './trip.service';
import { TripController } from './trip.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Trip } from 'src/trip/entities/trip.entity';
import { TripDay } from 'src/trip/entities/trip-day.entity';
import { TripPlace } from 'src/trip/entities/trip-place.entity';
import { TripNote } from 'src/trip/entities/trip-note.entity';
import { TripChecklist } from 'src/trip/entities/trip-checklist.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Trip,
      TripDay,
      TripPlace,
      TripNote,
      TripChecklist,
    ]),
  ],
  controllers: [TripController],
  providers: [TripService],
  exports: [TripService],
})
export class TripModule {}
