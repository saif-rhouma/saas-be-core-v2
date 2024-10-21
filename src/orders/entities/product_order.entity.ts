/* eslint-disable prettier/prettier */
import { Product } from 'src/products/entities/product.entity';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Order } from './order.entity';

@Entity()
export class ProductToOrder {
  @PrimaryGeneratedColumn()
  public id: number;

  @Column()
  public productId: number;

  @Column()
  public orderId: number;

  @Column()
  public quantity: number;

  @Column({ nullable: true })
  public discountPercentage: number;

  @Column({ nullable: true })
  public snapshotProductPrice: number;

  @ManyToOne(() => Product, (product) => product.productToOrder)
  public product: Product;

  @ManyToOne(() => Order, (order) => order.productToOrder, { cascade: true })
  public order: Order;
}
