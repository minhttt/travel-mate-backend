export class CreatePlaceDto {
  placeId: string;
  name: string;
  formattedAddress?: string;
  types?: string;
  photoUrl?: string;
  rating?: number;
  userRatingsTotal?: number;
  UserSavedId: number;
}
