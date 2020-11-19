import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  JoinTable,
  ManyToMany,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import ChannelChat from './ChannelChat';

import User from './User';

@Entity()
export default class Channel extends BaseEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  title!: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt!: Date;

  @ManyToMany((type) => User, (User) => User.channels, { cascade: true })
  @JoinTable({
    name: 'channel_member',
    joinColumn: { name: 'channel_id' },
    inverseJoinColumn: { name: 'user_id' },
  })
  users!: User[];

  @OneToMany((type) => ChannelChat, (ChannelChat) => ChannelChat.channel, {
    cascade: true,
  })
  chats!: ChannelChat[];
}
