import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryColumn,
} from 'typeorm';
import Channel from './Channel';
import { MessageImage } from './MessageImage';
import User from './User';

@Entity()
export class Message extends BaseEntity {
  @PrimaryColumn()
  id!: number;

  @Column()
  text!: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt!: Date;

  @OneToMany(() => MessageImage, (MessageImage) => MessageImage.message, {
    nullable: true,
  })
  images!: MessageImage[];

  @ManyToOne(() => User, (User) => User.messages)
  @JoinColumn({ name: 'user_id' })
  user!: User;

  @ManyToOne(() => Channel, (Channel) => Channel.messages)
  @JoinColumn({ name: 'channel_id' })
  channel!: Channel;
}
