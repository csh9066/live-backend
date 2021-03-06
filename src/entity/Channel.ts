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

  @ManyToMany((type) => User, (User) => User.channels)
  @JoinTable({
    name: 'channel_members',
    joinColumn: { name: 'channel_id' },
    inverseJoinColumn: { name: 'user_id' },
  })
  members!: User[];

  @OneToMany((type) => ChannelChat, (ChannelChat) => ChannelChat.channel)
  chats!: ChannelChat[];

  public includeMemberBy(memberId: number) {
    if (!this.members) {
      throw Error(
        'it is not exit to member in this channel, you need to join member'
      );
    }
    const member = this.members.find((member) => member.id === memberId);
    return member ? true : false;
  }
}
