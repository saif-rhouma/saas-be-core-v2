/* eslint-disable prettier/prettier */
import { Application } from 'src/applications/entities/application.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToMany,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Permission } from './permission.entity';
import { User } from './user.entity';

@Entity()
export class PermissionsGroup {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    unique: true,
  })
  name: string;

  @Column()
  description: string;

  @ManyToMany(() => Permission, (permission) => permission.groups)
  permissions: Permission[];

  @ManyToMany(() => User, (user) => user.groups)
  staffs: User[];

  @ManyToOne(() => Application, (application) => application.groups)
  application: Application;

  @CreateDateColumn()
  createTime: Date;

  @UpdateDateColumn()
  updateTime: Date;
}
