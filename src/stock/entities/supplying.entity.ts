/* eslint-disable prettier/prettier */
import { Plan } from 'src/plans/entities/plan.entity';
import { Product } from 'src/products/entities/product.entity';
// import { User } from 'src/users/entities/user.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

export enum SupplyingStatus {
  Pending = 'Pending Stock',
  Processing = 'Processing Stock',
  Ready = 'Ready To Deliver Stock',
  Delivered = 'Delivered Stock',
  Transferred = 'Transferred To Stock',
}

@Entity()
export class Supplying {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    nullable: true,
  })
  orderedAt: Date;

  @Column({
    nullable: true,
  })
  arrivesAt: Date;

  @Column('text', { default: SupplyingStatus.Pending })
  status: SupplyingStatus;

  @Column({
    nullable: true,
    default: 0,
  })
  quantity: number;

  @ManyToOne(() => Product, (product) => product.supplyings)
  product: Product;

  @OneToOne(() => Plan, (plan) => plan.supplying)
  plan: Plan;

  @CreateDateColumn()
  createTime: Date;

  @UpdateDateColumn()
  updateTime: Date;
}
