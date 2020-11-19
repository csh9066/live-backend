import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import ChannelChat from './ChannelChat';

@Entity()
export default class ChannelChatImage extends BaseEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  src!: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt!: Date;

  @ManyToOne(() => ChannelChat, (ChannelChat) => ChannelChat.images)
  @JoinColumn({ name: 'channel_chat_id' })
  chat!: ChannelChat;
}
