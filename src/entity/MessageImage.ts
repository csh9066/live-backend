import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryColumn,
} from 'typeorm';
import { Message } from './Message';

@Entity()
export class MessageImage extends BaseEntity {
  @PrimaryColumn()
  id!: number;

  @Column()
  src!: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt!: Date;

  @ManyToOne(() => Message, (Message) => Message.images)
  @JoinColumn({ name: 'message_id' })
  message!: Message;
}
