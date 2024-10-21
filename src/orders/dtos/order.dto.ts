/* eslint-disable prettier/prettier */
import { Expose, Transform } from 'class-transformer';

export class OrderDto {
  @Expose()
  id: number;
  @Expose()
  orderDate: Date;
  @Expose()
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  @Transform(({ value, obj }) => obj.customer.id)
  customer: number;
  @Expose()
  status: string;
  @Expose()
  isHidden: boolean;

  @Expose()
  snapshotTaxPercentage: number;

  @Expose()
  discount: number;

  @Expose()
  deliveryDate: Date;

  @Expose()
  ref: string;

  @Expose()
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  @Transform(({ value, obj }) => obj.createdBy.id)
  createdBy: number;

  @Expose()
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  @Transform(({ value, obj }) => {
    try {
      return obj.products.map((product) => product);
    } catch (error) {}
  })
  products: any[];
}
