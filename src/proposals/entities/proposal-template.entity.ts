/* eslint-disable prettier/prettier */
import { Column, CreateDateColumn, Entity, OneToMany, PrimaryColumn, UpdateDateColumn } from 'typeorm';
import { Proposal } from './proposal.entity';

export enum TemplateType {
  Manufacturing = 'Manufacturing',
  Business = 'Business',
}

@Entity()
export class ProposalTemplate {
  @PrimaryColumn('varchar', {
    length: 250,
  })
  id: string;

  @Column({ nullable: true })
  name: string;

  @Column({ nullable: true })
  description: string;

  @Column({ nullable: true })
  version: string;

  @Column('varchar', { default: TemplateType.Manufacturing })
  type: TemplateType;

  @OneToMany(() => Proposal, (proposal) => proposal.template)
  proposals: Proposal[];

  @Column({ nullable: true })
  file: string;

  @CreateDateColumn()
  createTime: Date;

  @UpdateDateColumn()
  updateTime: Date;
}
