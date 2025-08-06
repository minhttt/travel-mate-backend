import { Injectable } from '@nestjs/common';
import { CreateTripDto } from './dto/create-trip.dto';
import { Trip } from 'src/trip/entities/trip.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import {
  TripChecklistResponse,
  TripCountPlace,
  TripNoteResponse,
  TripPlaceResponse,
  TripResponse,
} from 'src/trip/interfaces/trip.interface';
import { TripChecklist } from 'src/trip/entities/trip-checklist.entity';
import { TripPlace } from 'src/trip/entities/trip-place.entity';
import { TripDay } from 'src/trip/entities/trip-day.entity';
import { TripNote } from 'src/trip/entities/trip-note.entity';
import { CreateTripPlaceDto } from 'src/trip/dto/create-trip-place.dto';
import { UpdateTripChecklistDto } from 'src/trip/dto/update-trip-checklist.dto';
// import { UpdateTripDto } from './dto/update-trip.dto';

@Injectable()
export class TripService {
  constructor(
    @InjectRepository(Trip)
    readonly tripRepo: Repository<Trip>,
    @InjectRepository(TripDay) private dayRepo: Repository<TripDay>,
    @InjectRepository(TripNote) private noteRepo: Repository<TripNote>,
    @InjectRepository(TripPlace) private placeRepo: Repository<TripPlace>,
    @InjectRepository(TripChecklist)
    private checklistRepo: Repository<TripChecklist>,
  ) {}
  async createTrip(createTripDto: CreateTripDto): Promise<TripResponse> {
    const trip: Trip = new Trip();
    trip.nametrip = createTripDto.nametrip;
    trip.usercreateid = createTripDto.usercreateid;
    trip.locationtrip = createTripDto.locationtrip;
    trip.note = createTripDto.note;
    trip.starttrip = createTripDto.starttrip;
    trip.endtrip = createTripDto.endtrip;
    console.log(`Trip name: ${createTripDto.nametrip}`);
    const savedTrip = await this.tripRepo.save(trip);

    await this.createTripDaysForTrip(
      savedTrip.tripid,
      createTripDto.starttrip,
      createTripDto.endtrip,
    );
    return {
      tripid: savedTrip.tripid,
      nametrip: savedTrip.nametrip,
      locationtrip: savedTrip.locationtrip,
      usercreateid: savedTrip.usercreateid,
      note: savedTrip.note,
      starttrip: savedTrip.starttrip,
      endtrip: savedTrip.endtrip,
    };
  }

  private async createTripDaysForTrip(
    tripid: number,
    startDate: Date,
    endDate: Date,
  ): Promise<void> {
    const start = new Date(startDate);
    const end = new Date(endDate);
    let dayNumber = 1;
    for (
      let currentDate = new Date(start);
      currentDate <= end;
      currentDate.setDate(currentDate.getDate() + 1)
    ) {
      const tripDay = new TripDay();
      tripDay.tripid = tripid;
      tripDay.daynumber = dayNumber;
      tripDay.date = new Date(currentDate);

      await this.dayRepo.save(tripDay);
      dayNumber++;
    }

    console.log(`Created ${dayNumber - 1} trip days for trip ${tripid}`);
  }

  async showTrip(usercreateid: number) {
    return await this.tripRepo.findBy({ usercreateid });
  }

  async showTripDetail(tripid: number) {
    const trip = await this.tripRepo.findOne({
      where: { tripid },
      relations: [
        'tripday',
        'tripday.tripnote',
        'tripday.tripplace',
        'tripday.tripchecklist',
      ],
    });
    return trip;
  }

  async deleteTrip(tripid: number) {
    await this.tripRepo.delete(tripid);
    return { success: true };
  }

  async addTripNote(
    tripdayid: number,
    content: string,
  ): Promise<TripNoteResponse> {
    const maxOrderResult = await this.noteRepo
      .createQueryBuilder('note')
      .where('note.tripdayid = :tripdayid', { tripdayid })
      .select('MAX(note.orderindex)', 'max')
      .getRawOne<{ max: number | null }>();
    const tripNote = new TripNote();
    tripNote.tripdayid = tripdayid;
    tripNote.content = content;
    tripNote.orderindex = (maxOrderResult?.max ?? 0) + 1;
    const savedNote = await this.noteRepo.save(tripNote);
    return {
      tripnoteid: savedNote.tripnoteid,
      tripdayid: savedNote.tripdayid,
      content: savedNote.content,
      orderindex: savedNote.orderindex,
    };
  }

  async updateTripNote(
    tripnoteid: number,
    content: string,
  ): Promise<TripNoteResponse> {
    await this.noteRepo.update(tripnoteid, { content });
    const updatedNote = await this.noteRepo.findOne({ where: { tripnoteid } });
    if (!updatedNote) {
      throw new Error(`TripNote with id ${tripnoteid} not found`);
    }
    return {
      tripnoteid: updatedNote.tripnoteid,
      tripdayid: updatedNote.tripdayid,
      content: updatedNote.content,
      orderindex: updatedNote.orderindex,
    };
  }
  async deleteTripNote(tripnoteid: number): Promise<void> {
    const result = await this.noteRepo.delete(tripnoteid);
    if (result.affected === 0) {
      throw new Error(`TripNote with id ${tripnoteid} not found`);
    }
  }

  async addTripPlace(
    tripdayid: number,
    createTripPlaceDto: CreateTripPlaceDto,
  ): Promise<TripPlaceResponse> {
    const maxOrderResult = await this.placeRepo
      .createQueryBuilder('place')
      .where('place.tripdayid = :tripdayid', { tripdayid })
      .select('MAX(place.orderindex)', 'max')
      .getRawOne<{ max: number | null }>();
    const tripPlace = new TripPlace();
    tripPlace.tripdayid = tripdayid;
    tripPlace.placeid = createTripPlaceDto.placeid;
    tripPlace.placename = createTripPlaceDto.placename;
    tripPlace.placeimg = createTripPlaceDto.placeimg;
    tripPlace.orderindex = (maxOrderResult?.max ?? 0) + 1;
    const savedPlace = await this.placeRepo.save(tripPlace);
    return {
      tripplaceid: savedPlace.tripplaceid,
      tripdayid: savedPlace.tripdayid,
      placeid: savedPlace.placeid,
      placename: savedPlace.placename,
      placeimg: savedPlace.placeimg,
      orderindex: savedPlace.orderindex,
    };
  }
  async deleteTripPlace(tripplaceid: number): Promise<void> {
    const result = await this.placeRepo.delete(tripplaceid);
    if (result.affected === 0) {
      throw new Error(`TripPlace with id ${tripplaceid} not found`);
    }
  }

  async addTripChecklist(
    tripdayid: number,
    content: string,
  ): Promise<TripChecklistResponse> {
    const maxOrderResult = await this.checklistRepo
      .createQueryBuilder('checklist')
      .where('checklist.tripdayid = :tripdayid', { tripdayid })
      .select('MAX(checklist.orderindex)', 'max')
      .getRawOne<{ max: number | null }>();
    const tripChecklist = new TripChecklist();
    tripChecklist.tripdayid = tripdayid;
    tripChecklist.content = content;
    tripChecklist.ischecked = false;
    tripChecklist.orderindex = (maxOrderResult?.max ?? 0) + 1;
    const savedChecklist = await this.checklistRepo.save(tripChecklist);
    return {
      tripchecklistid: savedChecklist.tripchecklistid,
      tripdayid: savedChecklist.tripdayid,
      content: savedChecklist.content,
      ischecked: savedChecklist.ischecked,
      orderindex: savedChecklist.orderindex,
    };
  }

  async updateTripChecklist(
    tripchecklistid: number,
    updateTripChecklistDto: UpdateTripChecklistDto,
  ): Promise<TripChecklistResponse> {
    const updateData: Partial<TripChecklist> = {};
    if (updateTripChecklistDto.content !== undefined)
      updateData.content = updateTripChecklistDto.content;
    if (updateTripChecklistDto.ischecked !== undefined)
      updateData.ischecked = updateTripChecklistDto.ischecked;
    await this.checklistRepo.update(tripchecklistid, updateData);
    const updatedChecklist = await this.checklistRepo.findOne({
      where: { tripchecklistid },
    });
    if (!updatedChecklist) {
      throw new Error(`TripChecklist with id ${tripchecklistid} not found`);
    }
    return {
      tripchecklistid: updatedChecklist.tripchecklistid,
      tripdayid: updatedChecklist.tripdayid,
      content: updatedChecklist.content,
      ischecked: updatedChecklist.ischecked,
      orderindex: updatedChecklist.orderindex,
    };
  }

  async deleteTripChecklist(tripcheckid: number): Promise<void> {
    const result = await this.checklistRepo.delete(tripcheckid);
    if (result.affected === 0) {
      throw new Error(`TripChecklist with id ${tripcheckid} not found`);
    }
  }

  async updateMixedItemsOrderWithTransaction(
    tripdayid: number,
    items: Array<{
      id: number;
      type: 'note' | 'place' | 'checklist';
      orderindex: number;
    }>,
  ): Promise<{ success: boolean }> {
    // Sử dụng transaction để đảm bảo tính nhất quán
    const queryRunner = this.noteRepo.manager.connection.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      // Update notes
      const noteItems = items.filter((item) => item.type === 'note');
      for (const item of noteItems) {
        await queryRunner.manager.update('tripnote', item.id, {
          orderindex: item.orderindex,
        });
      }
      // Update places
      const placeItems = items.filter((item) => item.type === 'place');
      for (const item of placeItems) {
        await queryRunner.manager.update('tripplace', item.id, {
          orderindex: item.orderindex,
        });
      }
      // Update checklists
      const checklistItems = items.filter((item) => item.type === 'checklist');
      for (const item of checklistItems) {
        await queryRunner.manager.update('tripchecklist', item.id, {
          orderindex: item.orderindex,
        });
      }
      await queryRunner.commitTransaction();
      return { success: true };
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  async getAllTripPlaceCounts(): Promise<TripCountPlace[]> {
    const trips = await this.tripRepo.find({
      relations: ['tripday', 'tripday.tripplace'],
    });
    return trips.map((trip) => {
      const tripPlaceCount = trip.tripday.reduce((total, day) => {
        return total + (day.tripplace.length || 0);
      }, 0);
      return {
        tripid: trip.tripid,
        nametrip: trip.nametrip,
        locationtrip: trip.locationtrip,
        tripPlaceCount,
      };
    });
  }
}
