/* eslint-disable prettier/prettier */
import { Customer } from 'src/customers/entities/customer.entity';
import { File } from 'src/files/entities/file.entity';
import { Financial } from 'src/financial/entities/financial-year.entity';
import { Order } from 'src/orders/entities/order.entity';
import { Payment } from 'src/payments/entities/payment.entity';
import { Plan } from 'src/plans/entities/plan.entity';
import { Category } from 'src/products/entities/category.entity';
import { ProductAddon } from 'src/products/entities/product-addon.entity';
import { Product } from 'src/products/entities/product.entity';
import { Reminder } from 'src/reminders/entities/reminder.entity';
import { Ticket } from 'src/tickets/entities/ticket.entity';
import { PermissionsGroup } from 'src/users/entities/permissions-group.entity';
import { User } from 'src/users/entities/user.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToMany,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

enum PrintPOSType {
  A4 = 'A4',
  Thermal = 'Thermal',
}
@Entity()
export class Application {
  @PrimaryGeneratedColumn()
  id: number;

  //! The Constraint for Unique May Be ADDED!
  @Column({
    nullable: false,
    length: 150,
  })
  name: string;

  @Column({
    nullable: true,
  })
  appLogo: string;

  @Column({
    nullable: true,
  })
  favicon: string;

  @Column({
    nullable: true,
  })
  description: string;
  @Column({
    nullable: true,
  })
  email: string;
  @Column({
    nullable: true,
  })
  phoneNumber: string;

  @Column('text', { default: PrintPOSType.A4 })
  printerPOS: PrintPOSType;

  @Column({
    nullable: true,
    default: 'USD',
    length: 20,
  })
  currencySymbol: string;

  @Column({
    nullable: true,
    default: 0,
  })
  taxPercentage: number;

  @Column({
    nullable: true,
  })
  taxNumber: number;

  @Column('simple-json', {
    nullable: true,
  })
  address: {
    country: string;
    state: string;
    city: string;
    district: string;
    zipCode: string;
    street: string;
  };

  @ManyToOne(() => User, (user) => user.userOwnedApps)
  owner: User;

  @OneToOne(() => Financial)
  @JoinColumn()
  financialYear: Financial;

  @ManyToMany(() => User, (user) => user.applications, { cascade: true })
  users: User[];

  @OneToMany(() => Product, (product) => product.application)
  products: Product[];

  @OneToMany(() => Category, (category) => category.application)
  categories: Category[];

  @OneToMany(() => Product, (productAddon) => productAddon.application)
  productAddons: ProductAddon[];

  @OneToMany(() => Customer, (customer) => customer.application)
  customers: Customer[];

  @OneToMany(() => Plan, (plan) => plan.application)
  plans: Plan[];

  @OneToMany(() => Order, (order) => order.application)
  orders: Order[];

  @OneToMany(() => Payment, (payment) => payment.application)
  payments: Payment[];

  @OneToMany(() => Ticket, (ticket) => ticket.application)
  tickets: Ticket[];

  @OneToMany(() => File, (file) => file.application)
  files: File[];

  @OneToMany(() => Reminder, (reminder) => reminder.application)
  reminders: Reminder[];

  @OneToMany(() => Financial, (financial) => financial.application)
  financialYears: Financial[];

  @OneToMany(() => PermissionsGroup, (pg) => pg.application)
  groups: PermissionsGroup[];

  @CreateDateColumn()
  createTime: Date;

  @UpdateDateColumn()
  updateTime: Date;
}
