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
import Channel from './Channel';
import ChannelChatImage from './ChannelChatImage';
import User from './User';

@Entity()
export default class ChannelChat extends BaseEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  content!: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt!: Date;

  @OneToMany(
    () => ChannelChatImage,
    (ChannelChatImage) => ChannelChatImage.chat,
    {
      nullable: true,
      eager: true,
    }
  )
  images!: ChannelChatImage[];

  @ManyToOne(() => User, (User) => User.channelChat)
  @JoinColumn({ name: 'author_id' })
  author!: User;

  @ManyToOne(() => Channel, (Channel) => Channel.chats)
  @JoinColumn({ name: 'channel_id' })
  channel!: Channel;
}
