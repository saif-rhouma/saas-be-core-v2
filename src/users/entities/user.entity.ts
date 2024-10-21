/* eslint-disable prettier/prettier */
import {
  AfterInsert,
  AfterRemove,
  AfterUpdate,
  Column,
  CreateDateColumn,
  Entity,
  JoinTable,
  ManyToMany,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { RefreshToken } from '../../auth/entities/token.entity';
import { Role } from './role.entity';
import { Permission } from './permission.entity';
import { Application } from 'src/applications/entities/application.entity';
import { Plan } from 'src/plans/entities/plan.entity';
import { Customer } from 'src/customers/entities/customer.entity';
import { Order } from 'src/orders/entities/order.entity';
import { Payment } from 'src/payments/entities/payment.entity';
import { Ticket } from 'src/tickets/entities/ticket.entity';
import { TicketMessage } from 'src/tickets/entities/ticket-message.entity';
import { Reminder } from 'src/reminders/entities/reminder.entity';
import { File } from 'src/files/entities/file.entity';
import { Financial } from 'src/financial/entities/financial-year.entity';
import { PermissionsGroup } from './permissions-group.entity';

export enum AccountType {
  Free = 'Free',
  Basic = 'Basic',
  Standard = 'Standard',
  Premium = 'Premium',
}

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    nullable: false,
    unique: true,
  })
  email: string;

  @Column()
  password: string;

  @Column({
    nullable: true,
  })
  firstName: string;

  @Column({
    nullable: true,
  })
  lastName: string;

  @Column({
    nullable: true,
  })
  phoneNumber: string;

  @Column('text', { default: AccountType.Free })
  accountType: AccountType;

  @Column({
    nullable: true,
  })
  avatar: string;

  @Column('simple-json', {
    nullable: true,
  })
  applicationThemeSetting: {
    appearance: { darkMode: boolean; contrast: boolean; compact: boolean; rightToLeft: boolean };
    navBar: { layout: string; color: string };
    presetsColor: string;
  };

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
    default: true,
  })
  isActive: boolean;

  @OneToMany(() => Application, (application) => application.owner)
  userOwnedApps: Application[];

  @ManyToMany(() => Application, (application) => application.users)
  @JoinTable()
  applications: Application[];

  @OneToMany(() => Plan, (plan) => plan.createdBy)
  plans: Plan[];

  @OneToMany(() => Ticket, (ticket) => ticket.createdBy)
  tickets: Ticket[];

  @OneToMany(() => Ticket, (ticket) => ticket.member)
  members: Ticket[];

  @OneToMany(() => TicketMessage, (ticketMessage) => ticketMessage.createdBy)
  messages: TicketMessage[];

  @OneToMany(() => Customer, (customer) => customer.createdBy)
  customers: Customer[];

  @OneToMany(() => Order, (order) => order.createdBy)
  orders: Order[];

  @OneToMany(() => Payment, (payment) => payment.createdBy)
  payments: Payment[];

  @OneToMany(() => Reminder, (reminder) => reminder.createdBy)
  reminders: Reminder[];

  @OneToMany(() => Financial, (financial) => financial.createdBy)
  financialYears: Financial[];

  @OneToMany(() => File, (file) => file.createdBy)
  files: File[];

  @ManyToMany(() => Role, (role) => role.users)
  @JoinTable()
  roles: Role[];

  @ManyToMany(() => Permission, (permission) => permission.users)
  permissions: Permission[];

  @ManyToMany(() => PermissionsGroup, (pg) => pg.staffs, { cascade: true })
  @JoinTable()
  groups: PermissionsGroup[];

  @ManyToMany(() => Ticket, (ticket) => ticket.mentions)
  @JoinTable()
  mentionedIn: Ticket[];

  @OneToMany(() => RefreshToken, (token) => token.user)
  tokens: RefreshToken[];

  @Column({
    nullable: true,
  })
  lastLogin: Date;

  @CreateDateColumn()
  createTime: Date;

  @UpdateDateColumn()
  updateTime: Date;

  @AfterInsert()
  logInsert() {
    console.log('Inserted User with id', this.id);
  }

  @AfterRemove()
  logRemove() {
    console.log('Removed User with id', this.id);
  }

  @AfterUpdate()
  logUpdate() {
    console.log('Updated User with id', this.id);
  }
}

// enum NavLayoutType {
//   Default = 'Default',
//   TopBar = 'TopBar',
//   Small = 'Small',
// }

// enum NavColor {
//   Integrate = 'Integrate',
//   Apparent = 'Apparent',
// }

// enum PresetsColor {
//   Preset01,
//   Preset02,
//   Preset03,
//   Preset04,
//   Preset05,
//   Preset06,
// }
