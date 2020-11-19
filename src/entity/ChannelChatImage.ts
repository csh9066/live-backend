import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryColumn,
} from 'typeorm';
import ChannelChat from './ChannelChat';

@Entity()
export default class MessageImage extends BaseEntity {
  @PrimaryColumn()
  id!: number;

  @Column()
  src!: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt!: Date;

  @ManyToOne(() => ChannelChat, (ChannelChat) => ChannelChat.images)
  @JoinColumn({ name: 'channel_chat_id' })
  chat!: ChannelChat;
}
