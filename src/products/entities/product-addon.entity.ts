/* eslint-disable prettier/prettier */
import { Application } from 'src/applications/entities/application.entity';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class ProductAddon {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  price: number;

  @Column()
  isActive: boolean;

  @ManyToOne(() => Application, (application) => application.products)
  application: Application;
}
