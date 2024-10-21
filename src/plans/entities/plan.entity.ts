/* eslint-disable prettier/prettier */
import { Application } from 'src/applications/entities/application.entity';
import { Order } from 'src/orders/entities/order.entity';
import { Product } from 'src/products/entities/product.entity';
import { Supplying } from 'src/stock/entities/supplying.entity';
import { User } from 'src/users/entities/user.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

export enum PlanStatus {
  Waiting = 'Waiting',
  Ready = 'Ready',
  Pending = 'Pending',
  ProcessingA = 'ProcessingA',
  ProcessingB = 'ProcessingB',
}

@Entity()
export class Plan {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: true })
  ref: string;

  @Column({
    nullable: true,
  })
  planDate: Date;

  @Column('text', { default: PlanStatus.Pending })
  status: PlanStatus;

  @Column({
    nullable: true,
    default: 1,
  })
  quantity: number;

  @Column('boolean', { default: false })
  isHidden: boolean;

  @Column('boolean', { default: false })
  isTransferred: boolean;

  @ManyToOne(() => Product, (product) => product.plans)
  product: Product;

  @ManyToOne(() => Order, (order) => order.plans)
  order: Order;

  @OneToOne(() => Supplying, (supplying) => supplying.plan)
  supplying: Supplying;

  @ManyToOne(() => User, (user) => user.plans)
  createdBy: User;

  @ManyToOne(() => Application, (application) => application.plans)
  application: Application;

  @CreateDateColumn()
  createTime: Date;

  @UpdateDateColumn()
  updateTime: Date;
}
