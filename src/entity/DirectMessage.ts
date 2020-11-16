import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryColumn,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { DirectMessageImage } from './DirectMessageImage';
import User from './User';

@Entity({
  name: 'direct_message',
})
export class DirectMessage extends BaseEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  content!: string;

  @Column({ name: 'is_read', default: false })
  isRead!: boolean;

  @CreateDateColumn({ name: 'created_at' })
  createdAt!: Date;

  @OneToMany(
    () => DirectMessageImage,
    (DirectMessageImage) => DirectMessageImage.message,
    { nullable: true }
  )
  images!: DirectMessageImage[];

  @ManyToOne(() => User, (User) => User.DirectMessages)
  @JoinColumn({ name: 'sender_id' })
  sender!: User;

  @ManyToOne(() => User, (User) => User.DirectMessages)
  @JoinColumn({ name: 'receiver_id' })
  receiver!: User;
}
