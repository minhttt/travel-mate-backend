import { Module } from '@nestjs/common';
import { PlacesService } from './places.service';
import { PlacesController } from './places.controller';
import { CacheModule } from '@nestjs/cache-manager';
import { redisStore } from 'cache-manager-redis-store';
import { HttpModule } from '@nestjs/axios';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Place } from 'src/places/entities/places.entity';

@Module({
  controllers: [PlacesController],
  imports: [
    CacheModule.registerAsync({
      useFactory: () => ({
        store: redisStore as any,
        host: redisStore || 'localhost',
        port: 6379,
        ttl: 2592000, // 30 days in seconds
      }),
    }),
    HttpModule.register({
      timeout: 5000,
      maxRedirects: 10,
    }),
    TypeOrmModule.forFeature([Place]),
  ],
  providers: [PlacesService],
})
export class PlacesModule {}
