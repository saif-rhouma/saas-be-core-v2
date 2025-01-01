/* eslint-disable prettier/prettier */
import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryColumn, UpdateDateColumn } from 'typeorm';
import { Customer } from 'src/customers/entities/customer.entity';
import { User } from 'src/users/entities/user.entity';
import { Application } from 'src/applications/entities/application.entity';
import { Product } from 'src/products/entities/product.entity';
import { ProposalTemplate } from './proposal-template.entity';

export enum ProposalStatus {
  Draft = 'Draft',
  Confirmed = 'Confirmed',
  Rejected = 'Rejected',
}

@Entity()
export class Proposal {
  @PrimaryColumn('varchar', {
    length: 250,
  })
  id: string;

  @Column('varchar', { default: ProposalStatus.Draft })
  status: ProposalStatus;

  @Column('simple-json', {
    nullable: true,
  })
  applicationSnapshot: Application;

  @Column('simple-json', {
    nullable: true,
  })
  productsSnapshot: Product[];

  @ManyToOne(() => ProposalTemplate, (proposalTemplate) => proposalTemplate.proposals)
  template: ProposalTemplate;

  @ManyToOne(() => Customer, (customer) => customer.orders)
  customer: Customer;

  @ManyToOne(() => User, (user) => user.orders)
  createdBy: User;

  @ManyToOne(() => Application, (application) => application.orders)
  application: Application;

  @CreateDateColumn()
  createTime: Date;

  @UpdateDateColumn()
  updateTime: Date;
}
