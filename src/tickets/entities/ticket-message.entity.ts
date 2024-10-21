/* eslint-disable prettier/prettier */
import { User } from 'src/users/entities/user.entity';
import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { Ticket } from './ticket.entity';

@Entity()
export class TicketMessage {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    nullable: true,
  })
  message: string;

  @ManyToOne(() => Ticket, (ticket) => ticket.messages)
  ticket: Ticket;

  @ManyToOne(() => User, (user) => user.messages)
  createdBy: User;

  @CreateDateColumn()
  createTime: Date;

  @UpdateDateColumn()
  updateTime: Date;
}
