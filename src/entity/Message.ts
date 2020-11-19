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
  content!: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt!: Date;

  @OneToMany(() => MessageImage, (MessageImage) => MessageImage.message, {
    nullable: true,
    eager: true,
  })
  images!: MessageImage[];

  @ManyToOne(() => User, (User) => User.messages)
  @JoinColumn({ name: 'author_id' })
  author!: User;

  @ManyToOne(() => Channel, (Channel) => Channel.messages)
  @JoinColumn({ name: 'channel_id' })
  channel!: Channel;
}
