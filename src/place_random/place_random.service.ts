import { PlaceRandom } from 'src/place_random/entities/place_random.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
@Injectable()
export class PlaceRandomService {
  constructor(
    @InjectRepository(PlaceRandom)
    private readonly placeRadomRepo: Repository<PlaceRandom>,
  ) {}

  getAllImage() {
    return this.placeRadomRepo.find();
  }
}
