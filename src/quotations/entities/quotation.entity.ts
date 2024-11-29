/* eslint-disable prettier/prettier */
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryColumn,
  UpdateDateColumn,
} from 'typeorm';
import { ProductToQuotation } from './product_quotation.entity';
import { Application } from 'src/applications/entities/application.entity';
import { User } from 'src/users/entities/user.entity';
import { Customer } from 'src/customers/entities/customer.entity';
import { Order } from 'src/orders/entities/order.entity';
import { Reminder } from 'src/reminders/entities/reminder.entity';
import { Ticket } from 'src/tickets/entities/ticket.entity';

export enum QuotationStatus {
  Canceled = 'Canceled',
  Created = 'Created',
  Confirmed = 'Confirmed',
  Converted = 'Converted',
}

@Entity()
export class Quotation {
  @PrimaryColumn('varchar', {
    length: 250,
  })
  id: string;

  @Column({ nullable: true })
  ref: string;

  @Column({ nullable: true })
  name: string;

  @Column({
    nullable: true,
  })
  quotationDate: Date;

  @Column({
    nullable: true,
  })
  expiredDate: Date;

  @Column({
    nullable: true,
    default: 0,
  })
  totalAmount: number;

  @Column({
    nullable: true,
    default: 0,
  })
  discount: number;

  @Column({
    nullable: true,
    default: 0,
  })
  snapshotTaxPercentage: number;

  @Column('varchar', { default: QuotationStatus.Created })
  status: QuotationStatus;

  @OneToMany(() => ProductToQuotation, (productToQuotation) => productToQuotation.quotation)
  productToQuotation!: ProductToQuotation[];

  @OneToOne(() => Order)
  @JoinColumn()
  order: Order;

  @ManyToOne(() => Customer, (customer) => customer.quotations)
  customer: Customer;

  @ManyToOne(() => User, (user) => user.quotations)
  createdBy: User;

  @ManyToOne(() => Application, (application) => application.quotations)
  application: Application;

  @OneToMany(() => Ticket, (ticket) => ticket.quotation)
  tickets: Ticket[];

  @OneToMany(() => Reminder, (reminder) => reminder.quotation)
  reminders: Reminder[];

  @CreateDateColumn()
  createTime: Date;

  @UpdateDateColumn()
  updateTime: Date;
}
