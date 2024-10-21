/* eslint-disable prettier/prettier */
import { Expose, Transform } from 'class-transformer';

export class ProductDto {
  @Expose()
  name: string;

  @Expose()
  description: string;

  @Expose()
  price: number;

  @Expose()
  isActive: boolean;

  @Expose()
  image: boolean;

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
