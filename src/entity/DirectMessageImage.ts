import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { DirectMessage } from './DirectMessage';

@Entity()
export class DirectMessageImage extends BaseEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  src!: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt!: Date;

  @ManyToOne(() => DirectMessage, (DirectMessage) => DirectMessage.images)
  @JoinColumn({ name: 'direct_message_id' })
  message!: DirectMessage;
}
