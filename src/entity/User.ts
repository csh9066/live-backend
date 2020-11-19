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
import Channel from './Channel';
import DirectMessage from './DirectMessage';
import ChnnelChat from './ChannelChat';

@Entity()
export default class User extends BaseEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ unique: true })
  email!: string;

  @Column()
  nickname!: string;

  @Column()
  provider!: string;

  @Column({ nullable: true, name: 'profile_img_url' })
  profileImageUrl!: string;

  @Column({ default: false })
  online!: boolean;

  @CreateDateColumn({ name: 'created_at' })
  createdAt!: Date;

  @ManyToMany(() => Channel, (Channel) => Channel.users)
  channels!: Channel[];

  @OneToMany(() => ChnnelChat, (ChnnelChat) => ChnnelChat.author)
  channelChat!: ChnnelChat[];

  @OneToMany(() => DirectMessage, (DirectMessage) => DirectMessage.sender)
  directMessages!: DirectMessage[];

  @ManyToMany(() => User, (User) => User.friends)
  @JoinTable({
    name: 'user_friends',
    inverseJoinColumn: { name: 'user_id' },
    joinColumn: { name: 'friend_id' },
  })
  friends!: User[];
}
