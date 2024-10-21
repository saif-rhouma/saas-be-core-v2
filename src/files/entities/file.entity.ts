/* eslint-disable prettier/prettier */
import { Application } from 'src/applications/entities/application.entity';
import { User } from 'src/users/entities/user.entity';
import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';

export enum FileType {
  Image = 'Image',
  Document = 'Doc',
  Other = 'Other',
}

export enum FileCategory {
  Product = 'Product',
  Payment = 'Payment',
  Ticket = 'Ticket',
  Reminder = 'Reminder',
  Category = 'Category',
  AppAvatar = 'AppAvatar',
  AppLogo = 'AppLogo',
  Avatar = 'Avatar',
}

@Entity()
export class File {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    nullable: false,
  })
  name: string;

  @Column({
    nullable: false,
  })
  originalName: string;

  @Column('text', { default: FileType.Image })
  type: FileType;

  @Column('text', { default: FileCategory.Product })
  category: FileCategory;

  @ManyToOne(() => User, (user) => user.files)
  createdBy: User;

  @ManyToOne(() => Application, (application) => application.files)
  application: Application;

  @CreateDateColumn()
  createTime: Date;

  @UpdateDateColumn()
  updateTime: Date;
}
