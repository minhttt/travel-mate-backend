import {
  IsDate,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';

export class CreateTripDto {
  @IsString()
  @IsOptional()
  nametrip: string;

  @IsString()
  @IsNotEmpty()
  locationtrip: string;

  @IsInt()
  @IsNotEmpty()
  usercreateid: number;

  @IsString()
  note: string;

  @IsDate()
  starttrip: Date;

  @IsDate()
  endtrip: Date;
}
