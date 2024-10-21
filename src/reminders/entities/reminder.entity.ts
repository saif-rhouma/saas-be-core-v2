/* eslint-disable prettier/prettier */
import { Application } from 'src/applications/entities/application.entity';
import { User } from 'src/users/entities/user.entity';
import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';

@Entity()
export class Reminder {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  reminderDate: Date;

  @Column({
    nullable: true,
  })
  title: string;

  @Column({
    nullable: true,
  })
  description: string;

  @Column({
    nullable: true,
    default: true,
  })
  isNotified: boolean;

  @Column({
    nullable: true,
  })
  file: string;

  @ManyToOne(() => Application, (application) => application.reminders)
  application: Application;

  @ManyToOne(() => User, (user) => user.reminders)
  createdBy: User;

  @CreateDateColumn()
  createTime: Date;

  @UpdateDateColumn()
  updateTime: Date;
}
