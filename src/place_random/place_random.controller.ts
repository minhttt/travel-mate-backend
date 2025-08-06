import { Controller, Get } from '@nestjs/common';
import { PlaceRandomService } from './place_random.service';

@Controller('place-random')
export class PlaceRandomController {
  constructor(private readonly placeRandomService: PlaceRandomService) {}
  @Get()
  findAll() {
    return this.placeRandomService.getAllImage();
  }
}
