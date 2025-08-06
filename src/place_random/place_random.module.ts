import { Module } from '@nestjs/common';
import { PlaceRandomService } from './place_random.service';
import { PlaceRandomController } from './place_random.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PlaceRandom } from 'src/place_random/entities/place_random.entity';

@Module({
  imports: [TypeOrmModule.forFeature([PlaceRandom])],
  controllers: [PlaceRandomController],
  providers: [PlaceRandomService],
})
export class PlaceRandomModule {}
