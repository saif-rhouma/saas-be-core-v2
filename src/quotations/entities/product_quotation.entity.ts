/* eslint-disable prettier/prettier */
import { Product } from 'src/products/entities/product.entity';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Quotation } from './quotation.entity';

@Entity()
export class ProductToQuotation {
  @PrimaryGeneratedColumn()
  public id: number;

  @Column()
  public productId: number;

  @Column({ nullable: true })
  public quotationId: number;

  @Column()
  public quantity: number;

  @Column({ nullable: true })
  public discountPercentage: number;

  @Column({ nullable: true })
  public snapshotProductPrice: number;

  @ManyToOne(() => Product, (product) => product.productToQuotation, { cascade: true })
  public product: Product;

  @ManyToOne(() => Quotation, (quotation) => quotation.productToQuotation, { cascade: true })
  public quotation: Quotation;
}
