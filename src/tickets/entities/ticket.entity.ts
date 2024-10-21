/* eslint-disable prettier/prettier */
import { Application } from 'src/applications/entities/application.entity';
import { User } from 'src/users/entities/user.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToMany,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { TicketMessage } from './ticket-message.entity';

export enum Priority {
  Low = 'Low',
  Medium = 'Medium',
  Hight = 'Hight',
}

export enum TicketStatus {
  Open = 'Open',
  Closed = 'Closed',
}

@Entity()
export class Ticket {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    nullable: true,
  })
  topic: string;

  @Column({
    nullable: true,
  })
  description: string;

  @ManyToOne(() => User, (user) => user.members)
  member: User;

  @ManyToMany(() => User, (user) => user.mentionedIn, { cascade: true, onDelete: null })
  mentions: User[];

  @Column('text', { default: Priority.Medium })
  priority: Priority;

  @Column({
    nullable: true,
  })
  file: string;

  @Column('text', { default: TicketStatus.Open })
  status: TicketStatus;

  @ManyToOne(() => User, (user) => user.tickets)
  createdBy: User;

  @OneToMany(() => TicketMessage, (message) => message.ticket, { cascade: true })
  messages: TicketMessage[];

  @ManyToOne(() => Application, (application) => application.tickets)
  application: Application;

  @CreateDateColumn()
  createTime: Date;

  @UpdateDateColumn()
  updateTime: Date;
}
