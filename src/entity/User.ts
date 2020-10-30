import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Message } from './Message';

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

  @OneToMany(() => Message, (Message) => Message.user)
  messages!: Message[];
  // async checkPassword(password: string): Promise<boolean> {
  //   const isEqual = await bcrypt.compare(password, this.password);
  //   return isEqual;
  // }
}
