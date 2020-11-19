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
import { Message } from './Message';

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

  @OneToMany((type) => Message, (Message) => Message.channel)
  messages!: Message[];
  // @JoinTable({
  //   name: 'join_room',
  //   joinColumn: { name: 'room_id' },
  //   inverseJoinColumn: { name: 'user_id' },
  // })
  // users!: User[];
}
