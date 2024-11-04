/* eslint-disable prettier/prettier */
import { Expose, Transform } from 'class-transformer';

export class QuotationDto {
  @Expose()
  id: string;

  @Expose()
  name: string;

  @Expose()
  quotationDate: Date;

  @Expose()
  expiredDate: Date;

  @Expose()
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  @Transform(({ value, obj }) => obj?.customer)
  customer;

  @Expose()
  status: string;

  @Expose()
  isHidden: boolean;

  @Expose()
  snapshotTaxPercentage: number;

  @Expose()
  discount: number;

  @Expose()
  ref: string;

  @Expose()
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  @Transform(({ value, obj }) => {
    return { id: obj.createdBy.id, firstName: obj.createdBy.firstName, lastName: obj.createdBy.lastName };
  })
  createdBy: any;

  @Expose()
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  @Transform(({ value, obj }) => {
    try {
      return obj.products.map((product) => product);
    } catch (error) {}
  })
  products: any[];

  @Expose()
  order;

  @Expose()
  totalAmount;

  @Expose()
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  @Transform(({ value, obj }) => {
    try {
      return obj.productToQuotation.map((product) => product);
    } catch (error) {}
  })
  productToQuotation;
}
