import { BlogLike } from 'src/blog_like/entities/blog_like.entity';
import { Blog } from 'src/blogs/entities/blog.entity';
import { Place } from 'src/places/entities/places.entity';
import { Trip } from 'src/trip/entities/trip.entity';
import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ unique: true })
  username: string;

  @Column({ unique: true })
  email: string;

  @Column({ type: 'timestamp', nullable: true })
  birthday: Date;

  @Column({ nullable: true })
  avatar: string;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  created_at: Date;

  @OneToMany(() => Blog, (blog) => blog.user, { onDelete: 'CASCADE' })
  blogs: Blog[];

  @OneToMany(() => Trip, (trip) => trip.user, { onDelete: 'CASCADE' })
  trips: Trip[];

  @OneToMany(() => Place, (place) => place.user, { onDelete: 'CASCADE' })
  places: Place[];

  @OneToMany(() => BlogLike, (bloglike) => bloglike.user, {
    onDelete: 'CASCADE',
  })
  blogLikes: BlogLike[];
}
