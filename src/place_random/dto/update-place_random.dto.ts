import { PartialType } from '@nestjs/mapped-types';
import { CreatePlaceRandomDto } from './create-place_random.dto';

export class UpdatePlaceRandomDto extends PartialType(CreatePlaceRandomDto) {}
