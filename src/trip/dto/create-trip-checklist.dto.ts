export class CreateTripChecklistDto {
  tripDayId: number;
  content: string;
  ischecked: boolean;
  orderIndex?: number;
}
