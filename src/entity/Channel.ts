import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Message } from './Message';

import User from './User';

export enum ChannelType {
  GROUP = 'gruop',
  DM = 'dm',
}

@Entity()
export default class Channel extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: number;

  @Column()
  title!: string;

  @Column({
    type: 'enum',
    enum: ChannelType,
  })
  type!: ChannelType;

  @CreateDateColumn({ name: 'created_at' })
  createdAt!: Date;

  @ManyToMany((type) => User, { eager: true })
  @JoinTable({
    name: 'channel_member',
    joinColumn: { name: 'channel_id' },
    inverseJoinColumn: { name: 'user_id' },
  })
  users!: User[];

  @OneToMany((type) => Message, (Message) => Message.channel)
  messages!: Message[];
  // @JoinTable({
  //   name: 'join_room',
  //   joinColumn: { name: 'room_id' },
  //   inverseJoinColumn: { name: 'user_id' },
  // })
  // users!: User[];
}
