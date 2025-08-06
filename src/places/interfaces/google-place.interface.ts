export interface GgPlace {
  placeId: string;
  name: string;
  businessStatus?: string;
  formattedAddress?: string;
  types?: string[];
  lat: number;
  lng: number;
  photoUrl?: string;
  rating?: number;
  userRatingsTotal?: number;
}

export interface placeDetail {
  placeId: string;
  name: string;
  business_status?: string;
  formatted_address?: string;
  types?: string[];
  website?: string;
  photos?: { photo_reference: string }[];
  rating?: number;
  user_ratings_total?: number;
  opening_hours?: {
    weekday_text?: string[];
  };
  price_level?: number;
  formatted_phone_number?: string;
  reviews?: {
    author_name: string;
    profile_photo_url: string;
    rating?: number;
    relative_time_description: string;
    text: string;
  }[];
}

export interface GooglePlaceApiResult {
  photoUrl: string | undefined;
  place_id: string;
  name: string;
  business_status?: string;
  formatted_address?: string;
  types?: string[];
  geometry: {
    location: {
      lat: number;
      lng: number;
    };
  };
  photos?: Array<{
    photo_reference: string;
  }>;
  rating?: number;
  user_ratings_total?: number;
}

export interface GooglePlaceApiResponse {
  results: GooglePlaceApiResult[];
  status: string;
  [key: string]: any;
}

export interface GooglePlacePhotoResponse {
  ref: string;
}

export interface AutocompletePlace {
  name: string;
  place_id: string;
}
