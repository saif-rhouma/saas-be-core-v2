/* eslint-disable prettier/prettier */
import { Application } from 'src/applications/entities/application.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Product } from './product.entity';

@Entity()
export class Category {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({
    nullable: true,
  })
  description: string;

  @Column({
    nullable: true,
  })
  image: string;

  @Column({
    nullable: true,
    default: true,
  })
  isActive: boolean;

  @OneToMany(() => Product, (product) => product.category, {
    cascade: true,
    onDelete: 'SET NULL', // Set the relation to null instead of deleting related orders
  })
  products: Product[];

  @ManyToOne(() => Application, (application) => application.categories)
  application: Application;

  @CreateDateColumn()
  createTime: Date;

  @UpdateDateColumn()
  updateTime: Date;
}
