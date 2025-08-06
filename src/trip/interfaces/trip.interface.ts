export interface TripResponse {
  tripid: number;
  nametrip: string;
  locationtrip: string;
  usercreateid: number;
  note: string;
  starttrip: Date;
  endtrip: Date;
}
export interface TripNoteResponse {
  tripnoteid: number;
  tripdayid: number;
  content: string;
  orderindex: number;
}

export interface TripPlaceResponse {
  tripplaceid: number;
  tripdayid: number;
  placeid: string;
  placename: string;
  placeimg: string;
  orderindex: number;
}

export interface TripChecklistResponse {
  tripchecklistid: number;
  tripdayid: number;
  content: string;
  ischecked: boolean;
  orderindex: number;
}

export interface TripCountPlace {
  tripid: number;
  nametrip: string;
  locationtrip: string;
  tripPlaceCount: number;
}
