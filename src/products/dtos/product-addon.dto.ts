/* eslint-disable prettier/prettier */
import { Expose, Transform } from 'class-transformer';

export class ProductAddonDto {
  @Expose()
  name: string;

  @Expose()
  price: number;

  @Expose()
  isActive: boolean;

  @Expose()
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  @Transform(({ value, obj }) => {
    return {
      id: obj.application.id,
      name: obj.application.name,
    };
  })
  application;
}
