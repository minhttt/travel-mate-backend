import { User } from 'src/users/entities/users.entity';
import { Entity, PrimaryColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
@Entity('places')
export class Place {
  @PrimaryColumn()
  placeId: string;

  @Column()
  name: string;

  @Column({ type: 'integer' })
  rating?: number;

  @Column()
  userRatingsTotal?: number;

  @Column()
  formattedAddress?: string;

  @Column()
  Type?: string;

  @Column()
  price: number;

  @Column()
  photoUrl?: string;

  @Column()
  UserSavedId: number;

  @ManyToOne(() => User, (user) => user.blogs, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'UserSavedId' })
  user: User;
}
