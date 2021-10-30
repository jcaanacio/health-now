import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  BaseEntity,
  BeforeInsert,
} from 'typeorm';
import { healthNowEncryption } from '../adapters/encryption';
import { UserRole } from '../interfaces/entities/user';

@Entity('user')
export class User extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: number;

  @Column()
  email!: string;

  @Column()
  username!: string;

  @Column()
  password!: string;

  @Column()
  firstname!: string;

  @Column()
  lastname!: string;

  @Column()
  address!: string;

  @Column()
  phone!: number;

  @Column()
  postcode!: number;

  @Column({
    type: 'enum',
    enum: UserRole,
    default: UserRole.USER,
  })
  role!: UserRole;

  @CreateDateColumn()
  created_at!: Date;

  @UpdateDateColumn()
  updated_at!: Date;

  @BeforeInsert()
  async beforeInsert() {
    const salt = await healthNowEncryption.generateSalt(10);
    this.password = await healthNowEncryption.hash({
      data: this.password,
      salt,
    });
  }

  async matchPassword(inputPassword: string): Promise<Boolean> {
    return await healthNowEncryption.match({
      inputPassword: inputPassword,
      password: this.password,
    });
  }
}
