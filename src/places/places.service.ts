/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-call */
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Cache } from 'cache-manager';
import { Repository } from 'typeorm';
import axios from 'axios';
import {
  AutocompletePlace,
  GgPlace,
  GooglePlaceApiResponse,
  GooglePlaceApiResult,
  placeDetail,
} from 'src/places/interfaces/google-place.interface';
import { Storage } from '@google-cloud/storage';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { Place } from 'src/places/entities/places.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { CreatePlaceDto } from 'src/places/dto/create-place.dto';
// import { firebaseStorage } from 'src/config/firebase_config';
// import { gzip } from 'zlib';
// import { credential } from 'firebase-admin';

@Injectable()
export class PlacesService {
  private readonly storage: Storage;

  private readonly bucketName = process.env.STORAGE_BUCKET || '';
  private readonly GOOGLE_API_KEY = process.env.GG_API_KEY;
  private readonly BASE_URL = 'https://maps.googleapis.com/maps/api/place';

  constructor(
    @Inject(CACHE_MANAGER)
    private cacheManager: Cache,
    private readonly httpService: HttpService,
    @InjectRepository(Place)
    private readonly placeRepo: Repository<Place>,
  ) {
    this.storage = new Storage({
      projectId: process.env.PROJECT_ID,
      credentials: {
        client_email: process.env.CLIENT_EMAIL,
        private_key: process.env.PRIVATE_KEY?.replace(/\\n/g, '\n'),
      },
    });
  }

  async getPlacePhoto(ref: string, placeId: string): Promise<string> {
    const cacheIdPlacePhoto = `placeId=${placeId}`;
    const cachedPhoto = await this.cacheManager.get<string>(cacheIdPlacePhoto);
    if (cachedPhoto) return cachedPhoto;
    console.log(`Cache miss for photo reference:`, cacheIdPlacePhoto);
    const url = `https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=${ref}`;
    const response = await axios.get(url, {
      responseType: 'arraybuffer',
      params: {
        key: this.GOOGLE_API_KEY,
        maxwidth: 400,
        photo_reference: ref,
      },
    });
    const buffer = Buffer.from(response.data, 'binary');
    const fileName = `placesPhoto/${placeId}.jpg`;
    const file = this.storage.bucket(this.bucketName).file(fileName);

    const [exists] = await file.exists();
    if (exists) {
      const publicUrl = `https://storage.googleapis.com/${this.bucketName}/${fileName}`;
      await this.cacheManager.set(cacheIdPlacePhoto, publicUrl);
      return publicUrl;
    }
    await file.save(buffer, {
      metadata: {
        contentType: 'image/jpeg',
      },
      public: true,
      gzip: true,
    });
    const publicUrl = `https://storage.googleapis.com/${this.bucketName}/${fileName}`;
    await this.cacheManager.set(
      cacheIdPlacePhoto,
      publicUrl,
      60 * 60 * 24 * 30,
    ); // lưu cache 1 tháng
    return publicUrl;
  }

  async searchPlaces(query: string): Promise<GgPlace[]> {
    const cacheSearchQuery = `search:${query}`;
    const cached = await this.cacheManager.get<GgPlace[]>(cacheSearchQuery);
    if (cached) return cached;
    console.log('Cache miss: ', cacheSearchQuery);
    const response = await axios.get<GooglePlaceApiResponse>(
      `${this.BASE_URL}/textsearch/json`,
      {
        params: {
          query,
          key: this.GOOGLE_API_KEY,
          language: 'vi',
        },
      },
    );
    const results: GooglePlaceApiResult[] = response.data.results;

    if (!results) throw new NotFoundException('không tìm thấy địa điểm');

    const mappedPlaces = await Promise.all(
      results.map(async (place): Promise<GgPlace> => {
        const photoReference = place.photos?.[0]?.photo_reference;
        const photoUrl = photoReference
          ? await this.getPlacePhoto(photoReference, place.place_id)
          : undefined;

        return {
          placeId: place.place_id,
          name: place.name,
          businessStatus: place.business_status,
          formattedAddress: place.formatted_address,
          types: place.types,
          lat: place.geometry.location.lat,
          lng: place.geometry.location.lng,
          photoUrl,
          rating: place.rating,
          userRatingsTotal: place.user_ratings_total,
        };
      }),
    );
    await this.cacheManager.set(
      cacheSearchQuery,
      mappedPlaces,
      60 * 60 * 24 * 30,
    ); // lưu cache 1 tháng
    return mappedPlaces;
  }

  async placeDetail(placeId: string): Promise<any> {
    const cacheIdPlaceDetail = `place-detail: ${placeId}`;
    const cached = await this.cacheManager.get<any>(cacheIdPlaceDetail);
    if (cached) return cached;
    console.log('Cache miss:', cacheIdPlaceDetail);
    const response = await axios.get(
      'https://maps.googleapis.com/maps/api/place/details/json',
      {
        params: {
          place_id: placeId,
          key: this.GOOGLE_API_KEY,
          language: 'vi',
          fields: [
            'name',
            'rating',
            'formatted_address',
            'formatted_phone_number',
            'user_ratings_total',
            'photos',
            'opening_hours',
            'website',
            'price_level',
            'reviews',
          ].join(','),
        },
      },
    );
    const result: placeDetail = response.data.result;
    if (!result) throw new NotFoundException('Không tìm được địa điểm');
    const photoRefs: string[] =
      result.photos?.map((p) => p.photo_reference) ?? [];
    const uploadedPhotos = await Promise.all(
      photoRefs
        .slice(0, 4)
        .map((ref, index) =>
          this.getPlacePhoto(ref, `${placeId}-photo-${index}`),
        ),
    );
    const placeDetailWithPhoto = {
      name: result.name,
      rating: result.rating,
      address: result.formatted_address,
      phone: result.formatted_phone_number,
      totalRating: result.user_ratings_total,
      opening: result.opening_hours?.weekday_text ?? [],
      website: result.website ?? '',
      price: result.price_level,
      reviews:
        result.reviews?.map((review) => ({
          author_name: review.author_name,
          author_profile_photo: review.profile_photo_url,
          rating: review.rating,
          relative_time_des: review.relative_time_description,
          text: review.text,
        })) ?? [],
      photos: uploadedPhotos,
    };
    await this.cacheManager.set(
      cacheIdPlaceDetail,
      placeDetailWithPhoto,
      60 * 60 * 24 * 30,
    ); // lưu cache 1 tháng

    return placeDetailWithPhoto;
  }

  async autoCompleteSearch(input: string): Promise<AutocompletePlace[]> {
    const url = `${this.BASE_URL}/autocomplete/json?input=${encodeURIComponent(
      input,
    )}&key=${this.GOOGLE_API_KEY}&language=vi`;
    const response = await firstValueFrom(this.httpService.get(url));
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return response.data.predictions.map((prediction: any) => ({
      name:
        prediction.structured_formatting?.main_text || prediction.description,
      place_id: prediction.place_id,
    }));
  }

  async savePlace(createPlaceDto: CreatePlaceDto): Promise<any> {
    const place: Place = new Place();
    place.placeId = createPlaceDto.placeId;
    place.name = createPlaceDto.name;
    place.formattedAddress = createPlaceDto.formattedAddress;
    place.Type = createPlaceDto.types;
    place.rating = createPlaceDto.rating;
    place.photoUrl = createPlaceDto.photoUrl;
    place.userRatingsTotal = createPlaceDto.userRatingsTotal;
    place.UserSavedId = createPlaceDto.UserSavedId;
    const existing = await this.placeRepo.findOne({
      where: { placeId: place.placeId, UserSavedId: place.UserSavedId },
    });

    if (existing) {
      throw new BadRequestException('Địa điểm này đã được lưu');
    }
    const savedPlace = await this.placeRepo.save(place);
    return {
      placeId: savedPlace.placeId,
      name: savedPlace.name,
      rating: savedPlace.rating,
      userRatingsTotal: savedPlace.userRatingsTotal,
      formattedAddress: savedPlace.formattedAddress,
      Type: '',
      price: savedPlace.price,
      photoUrl: `https://storage.googleapis.com/travelmate-d89fd.firebasestorage.app/placesPhoto/${savedPlace.placeId}.jpg`,
      UserSavedId: savedPlace.UserSavedId,
    };
  }

  async showSavePlace(UserSavedId: number) {
    return await this.placeRepo.findBy({ UserSavedId });
  }

  async deleteSavePlace(placeId: string): Promise<{ message: string }> {
    const result = await this.placeRepo.delete(placeId);
    if (result.affected === 0) {
      throw new NotFoundException(
        `Không tìm thấy địa điểm với id: ${placeId} để xóa`,
      );
    }
    return { message: `Đã xóa địa điểm có id là: ${placeId}` };
  }

  async isPlaceSaved(UserSavedId: number, placeId: string): Promise<boolean> {
    const saved = await this.placeRepo.findOne({
      where: {
        UserSavedId: UserSavedId,
        placeId: placeId,
      },
    });
    return !!saved;
  }
}
