import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';
import bcrypt from 'bcryptjs';

@Entity()
export default class User extends BaseEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ unique: true })
  email!: string;

  @Column({ nullable: true })
  password!: string;

  @Column()
  nickname!: string;

  @Column({ nullable: true })
  provider!: string;

  @Column({ nullable: true, name: 'sns_id' })
  snsId!: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt!: Date;

  async checkPaaword(password: string): Promise<boolean> {
    const isEqual = await bcrypt.compare(password, this.password);
    console.log(isEqual);

    return isEqual;
  }
}
