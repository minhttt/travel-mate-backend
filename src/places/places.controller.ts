import {
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
  HttpStatus,
  // Post,
  // Body,
  // Patch,
  Param,
  Post,
  // Delete,
  Query,
} from '@nestjs/common';
import { PlacesService } from './places.service'; // Adjust the path if your Place model is elsewhere
import { GgPlace } from 'src/places/interfaces/google-place.interface';
import { CreatePlaceDto } from 'src/places/dto/create-place.dto';

@Controller('places')
export class PlacesController {
  constructor(private readonly placesService: PlacesService) {}
  @Get('search')
  async searchPlaces(
    @Query('query') query: string,
  ): Promise<{ status: string; data: GgPlace[] }> {
    try {
      if (!query) {
        throw new HttpException(
          'Missing required query parameter: query',
          HttpStatus.BAD_REQUEST,
        );
      }
      const places = await this.placesService.searchPlaces(query);
      return {
        status: 'success',
        data: places,
      };
    } catch (error) {
      throw new HttpException(
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
        `Error searching places: ${error.message}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get('detail/:placeId')
  getPlaceDetail(@Param('placeId') placeId: string) {
    return this.placesService.placeDetail(placeId);
  }

  @Get('autocomplete')
  async getAutoComplete(@Query('input') input: string) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return await this.placesService.autoCompleteSearch(input);
  }

  @Post('save')
  async savePlace(@Body() createPlaceDto: CreatePlaceDto) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return this.placesService.savePlace(createPlaceDto);
  }

  @Get('save/view/:userId')
  async viewSavePlaces(@Param('userId') userId: number) {
    return await this.placesService.showSavePlace(userId);
  }

  @Delete('save/delete/:placeId')
  async deleteSavePlace(@Param('placeId') placeId: string) {
    return await this.placesService.deleteSavePlace(placeId);
  }

  @Get('save/issaved/:userId/:placeId')
  async isPlaceSaved(
    @Param('userId') userId: number,
    @Param('placeId') placeId: string,
  ) {
    return await this.placesService.isPlaceSaved(userId, placeId);
  }
}
