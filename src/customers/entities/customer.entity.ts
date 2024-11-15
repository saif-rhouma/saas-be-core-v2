/* eslint-disable prettier/prettier */
import { Application } from 'src/applications/entities/application.entity';
import { Order } from 'src/orders/entities/order.entity';
import { Payment } from 'src/payments/entities/payment.entity';
import { Quotation } from 'src/quotations/entities/quotation.entity';
import { User } from 'src/users/entities/user.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class Customer {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    nullable: true,
  })
  ref: string;

  @Column({
    nullable: false,
  })
  name: string;

  @Column({
    nullable: false,
  })
  email: string;

  @Column({
    nullable: true,
  })
  phoneNumber: string;

  @Column('simple-json', {
    nullable: true,
  })
  address: {
    country: string;
    state: string;
    city: string;
    zipCode: string;
    street: string;
  };

  @Column({
    nullable: true,
  })
  taxNumber: string;

  @Column({
    nullable: true,
  })
  avatar: string;

  @Column('boolean', { default: true })
  isActive: boolean;

  @ManyToOne(() => Application, (application) => application.customers)
  application: Application;

  @ManyToOne(() => User, (user) => user.customers)
  createdBy: User;

  @OneToMany(() => Order, (order) => order.customer)
  orders: Order[];

  @OneToMany(() => Quotation, (quotation) => quotation.customer)
  quotations: Quotation[];

  @OneToMany(() => Payment, (payment) => payment.customer)
  payments: Payment[];

  @CreateDateColumn()
  createTime: Date;

  @UpdateDateColumn()
  updateTime: Date;
}
