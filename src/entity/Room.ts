import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

import User from './User';

@Entity()
export default class Room extends BaseEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  title!: string;

  @Column()
  describe!: string;

  @Column({ name: 'image_url', nullable: true })
  imageUrl!: string;

  // 룸의 인원 수
  @Column({ name: 'max_user', width: 8, default: 4 })
  maxUser!: number;

  @Column({ nullable: true })
  password!: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt!: Date;

  // 룸의 방장 아이디
  @OneToOne((type) => User)
  @JoinColumn({ name: 'owner_id' })
  ownerId!: User;

  @ManyToMany((type) => User, { onDelete: 'CASCADE', eager: true })
  @JoinTable({
    name: 'join_room',
    joinColumn: { name: 'room_id' },
    inverseJoinColumn: { name: 'user_id' },
  })
  users!: User[];
}
