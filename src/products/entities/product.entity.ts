/* eslint-disable prettier/prettier */
import { Application } from 'src/applications/entities/application.entity';
import { ProductToOrder } from 'src/orders/entities/product_order.entity';
import { Plan } from 'src/plans/entities/plan.entity';
import { Stock } from 'src/stock/entities/stock.entity';
import { Supplying } from 'src/stock/entities/supplying.entity';
import { Column, Entity, ManyToOne, OneToMany, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Category } from './category.entity';

@Entity()
export class Product {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({
    nullable: true,
  })
  description: string;

  @Column()
  price: number;

  @Column({
    nullable: true,
  })
  image: string;

  @Column()
  isActive: boolean;

  @ManyToOne(() => Application, (application) => application.products)
  application: Application;

  @ManyToOne(() => Category, (category) => category.products, { nullable: true })
  category: Category;

  @OneToMany(() => Plan, (plan) => plan.product)
  plans: Plan[];

  @OneToOne(() => Stock, (stock) => stock.product)
  stock: Stock;

  @OneToMany(() => Supplying, (supplying) => supplying.product)
  supplyings: Supplying[];

  @OneToMany(() => ProductToOrder, (productToOrder) => productToOrder.product, { cascade: true })
  productToOrder!: ProductToOrder[];
  product: Stock[];
}
