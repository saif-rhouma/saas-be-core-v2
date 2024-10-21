/* eslint-disable prettier/prettier */
import { Application } from 'src/applications/entities/application.entity';
import { Customer } from 'src/customers/entities/customer.entity';
import { Order } from 'src/orders/entities/order.entity';
import { User } from 'src/users/entities/user.entity';
import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';

export enum PaymentType {
  Cash = 'Cash',
  Transfer = 'Transfer',
  Card = 'Card',
}

@Entity()
export class Payment {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    nullable: true,
  })
  paymentDate: Date;

  @Column({
    nullable: true,
  })
  paymentType: PaymentType;

  @Column({
    nullable: true,
  })
  amount: number;

  @Column({
    nullable: true,
  })
  notes: string;

  @Column({
    nullable: true,
  })
  attachments: string;

  @ManyToOne(() => Customer, (customer) => customer.payments)
  customer: Customer;

  @ManyToOne(() => Order, (order) => order.payments, { onDelete: 'CASCADE' })
  order: Order;

  @ManyToOne(() => User, (user) => user.payments)
  createdBy: User;

  @ManyToOne(() => Application, (application) => application.payments)
  application: Application;

  @CreateDateColumn()
  createTime: Date;

  @UpdateDateColumn()
  updateTime: Date;
}
