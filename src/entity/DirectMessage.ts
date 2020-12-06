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
import DirectMessageImage from './DirectMessageImage';
import User from './User';

@Entity({
  name: 'direct_message',
})
export default class DirectMessage extends BaseEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  content!: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt!: Date;

  @OneToMany(
    () => DirectMessageImage,
    (DirectMessageImage) => DirectMessageImage.message,
    { nullable: true, eager: true }
  )
  images!: DirectMessageImage[];

  @ManyToOne(() => User, (User) => User.directMessages)
  @JoinColumn({ name: 'sender_id' })
  sender!: User;

  @ManyToOne(() => User, (User) => User.directMessages)
  @JoinColumn({ name: 'receiver_id' })
  receiver!: User;
}
