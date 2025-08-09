import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/users/entities/users.entity';
import { PlacesModule } from './places/places.module';
import { HttpModule } from '@nestjs/axios';
import { BlogsModule } from './blogs/blogs.module';
import { Blog } from 'src/blogs/entities/blog.entity';
import { BlogImages } from 'src/blogs/entities/blog_image.entity';
import { TripModule } from './trip/trip.module';
import { Trip } from 'src/trip/entities/trip.entity';
import { Place } from 'src/places/entities/places.entity';
import { TripDay } from 'src/trip/entities/trip-day.entity';
import { TripPlace } from 'src/trip/entities/trip-place.entity';
import { TripNote } from 'src/trip/entities/trip-note.entity';
import { TripChecklist } from 'src/trip/entities/trip-checklist.entity';
import { BudgetModule } from './budget/budget.module';
import { Budget } from 'src/budget/entities/budget.entity';
import { BlogLikeModule } from './blog_like/blog_like.module';
import { BlogLike } from 'src/blog_like/entities/blog_like.entity';
import { PlaceRandomModule } from './place_random/place_random.module';
import { PlaceRandom } from 'src/place_random/entities/place_random.entity';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),

    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (ConfigService: ConfigService) => ({
        type: 'postgres',
        host: ConfigService.get('DB_HOST'),
        port: ConfigService.get<number>('DB_PORT'),
        username: ConfigService.get('DB_USERNAME'),
        password: ConfigService.get('DB_PASSWORD'),
        database: ConfigService.get('DB_NAME'),
        entities: [
          User,
          Blog,
          BlogImages,
          Trip,
          Place,
          TripDay,
          TripPlace,
          TripNote,
          TripChecklist,
          Budget,
          BlogLike,
          PlaceRandom,
        ],
        synchronize: true,
        ssl: {
          rejectUnauthorized: false,
        },
      }),
      inject: [ConfigService],
    }),
    AuthModule,
    UsersModule,
    PlacesModule,
    BlogsModule,
    HttpModule,
    BlogsModule,
    TripModule,
    BudgetModule,
    BudgetModule,
    BlogLikeModule,
    PlaceRandomModule,
  ],
})
export class AppModule {}
