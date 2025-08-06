import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Put,
  Delete,
  ParseIntPipe,
  // Patch,
  // Param,
  // Delete,
} from '@nestjs/common';
import { TripService } from './trip.service';
import { CreateTripDto } from './dto/create-trip.dto';
import { CreateTripPlaceDto } from 'src/trip/dto/create-trip-place.dto';
import { UpdateTripChecklistDto } from 'src/trip/dto/update-trip-checklist.dto';
// import { UpdateTripDto } from './dto/update-trip.dto';

@Controller('trips')
export class TripController {
  constructor(private readonly tripService: TripService) {}
  @Post()
  async createTrip(@Body() createTripDto: CreateTripDto) {
    return this.tripService.createTrip(createTripDto);
  }
  @Get('place-counts')
  async getTripsWithPlaceCount() {
    return this.tripService.getAllTripPlaceCounts();
  }
  @Get(':usercreateid')
  async showTrip(@Param('usercreateid') usercreateid: number) {
    return this.tripService.showTrip(usercreateid);
  }

  @Get('trip-detail/:tripid')
  async tripDetail(@Param('tripid') tripid: number) {
    return this.tripService.showTripDetail(tripid);
  }
  //CRUD NOTE
  @Post('trip-detail/:tripdayid/note')
  addTripNote(
    @Param('tripdayid') tripdayid: number,
    @Body('content') content: string,
  ) {
    return this.tripService.addTripNote(tripdayid, content);
  }

  @Put('note/update/:noteid')
  updateTripNote(
    @Param('noteid') noteid: number,
    @Body('content') content: string,
  ) {
    return this.tripService.updateTripNote(noteid, content);
  }

  @Delete('note/delete/:noteid')
  deleteTripNote(@Param('noteid') noteid: number) {
    return this.tripService.deleteTripNote(noteid);
  }
  //CRUD NOTE

  //CRUD PLACE
  @Post('trip-detail/:tripdayid/place')
  addTripPlace(
    @Param('tripdayid') tripdayid: number,
    @Body() createTripPlaceDto: CreateTripPlaceDto,
  ) {
    return this.tripService.addTripPlace(tripdayid, createTripPlaceDto);
  }

  @Delete('place/delete/:tripplaceid')
  deleteTripPlace(@Param('tripplaceid') tripplaceid: number) {
    return this.tripService.deleteTripPlace(tripplaceid);
  }
  //CRUD PLACE

  //CRUD CHECKLIST
  @Post('trip-detail/:tripdayid/checklist')
  addTripChecklist(
    @Param('tripdayid') tripdayid: number,
    @Body('content') content: string,
  ) {
    return this.tripService.addTripChecklist(tripdayid, content);
  }

  @Put('checklist/update/:checklistid')
  updateTripChecklist(
    @Param('checklistid') checklistid: number,
    @Body() updateTripChecklistDto: UpdateTripChecklistDto,
  ) {
    return this.tripService.updateTripChecklist(
      checklistid,
      updateTripChecklistDto,
    );
  }

  @Delete('checklist/delete/:checklistid')
  deleteTripChecklist(@Param('checklistid') checklistid: number) {
    return this.tripService.deleteTripChecklist(checklistid);
  }
  //CRUD CHECKLIST

  //MIXED ORDER
  @Put('trip-detail/:tripdayid/order-mixed')
  updateMixedTripScheduleOrder(
    @Param('tripdayid') tripdayid: number,
    @Body()
    body: {
      schedules: {
        id: number;
        type: 'place' | 'note' | 'checklist';
        orderindex: number;
      }[];
    },
  ) {
    return this.tripService.updateMixedItemsOrderWithTransaction(
      tripdayid,
      body.schedules,
    );
  }

  @Delete('delete/:tripid')
  deleteTrip(@Param('tripid', ParseIntPipe) tripid: number) {
    return this.tripService.deleteTrip(tripid);
  }
}
