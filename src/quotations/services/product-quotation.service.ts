/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common';
import { ProductToQuotation } from '../entities/product_quotation.entity';
import { In, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Quotation } from '../entities/quotation.entity';
import { Product } from 'src/products/entities/product.entity';

@Injectable()
export class ProductQuotationService {
  constructor(@InjectRepository(ProductToQuotation) private repo: Repository<ProductToQuotation>) {}

  async assignProductToOrder(quotation: Quotation, productsData: any[], products: Product[]) {
    for (const element of productsData) {
      const productToQuotation = new ProductToQuotation();

      const product = products.find((prod) => prod.id === element.id);

      productToQuotation.quotation = quotation;
      productToQuotation.product = product;
      productToQuotation.quotationId = quotation.id;
      productToQuotation.productId = product.id;
      productToQuotation.quantity = element.quantity;
      productToQuotation.snapshotProductPrice = element.snapshotProductPrice;

      const prodToQuotation = this.repo.create(productToQuotation);
      await this.repo.save(prodToQuotation);
    }
  }

  async assignProductToQuotation(quotation: Quotation, productsData: any[], products: Product[]) {
    for (const element of productsData) {
      const productToQuotation = new ProductToQuotation();

      const product = products.find((prod) => prod.id === element.id);

      productToQuotation.quotation = quotation;
      productToQuotation.product = product;
      productToQuotation.quotationId = quotation.id;
      productToQuotation.productId = product.id;
      productToQuotation.quantity = element.quantity;
      productToQuotation.snapshotProductPrice = element.snapshotProductPrice;
      const prodToQuotation = this.repo.create(productToQuotation);
      await this.repo.save(prodToQuotation);
      quotation.productToQuotation.push(prodToQuotation);
    }
  }

  async remove(quotationId: number) {
    if (!quotationId) {
      return null;
    }
    const res = await this.repo
      .createQueryBuilder()
      .delete()
      .from(ProductToQuotation)
      .where('quotationId = :id', {
        id: quotationId,
      })
      .execute();
    return res;
  }

  async removeAllByQuotationId(quotationId: number) {
    if (!quotationId) {
      return null;
    }
    console.log('---> quotationId', quotationId);
    return this.repo.delete({ quotation: { id: quotationId } });
  }

  async removeAllByIds(Ids: number[]) {
    console.log('---> Ids', Ids);
    return this.repo.delete({ id: In(Ids) });
  }
}
