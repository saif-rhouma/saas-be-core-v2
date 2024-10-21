import { Injectable, NotFoundException } from '@nestjs/common';
import { ProductAddon } from '../entities/product-addon.entity';
import { Repository } from 'typeorm';
import { ApplicationsService } from 'src/applications/services/applications.service';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateProductAddonDto } from '../dtos/create-product-addon.dto';
import { MSG_EXCEPTION } from 'src/common/constants/messages';
import { UpdateProductAddonDto } from '../dtos/update-product-addon.dto';

@Injectable()
export class ProductAddonsService {
  constructor(
    @InjectRepository(ProductAddon) private repo: Repository<ProductAddon>,
    private applicationsService: ApplicationsService,
  ) {}

  async create(productAddonData: CreateProductAddonDto, applicationId: number) {
    const application = await this.applicationsService.findOne(applicationId);
    if (!application) {
      throw new NotFoundException(MSG_EXCEPTION.NOT_FOUND_APPLICATION);
    }
    const productAddon = this.repo.create(productAddonData);
    productAddon.application = application;
    return this.repo.save(productAddon);
  }

  findOne(id: number) {
    if (!id) {
      return null;
    }
    const productAddon = this.repo.findOneBy({ id });
    return productAddon;
  }

  async findByIds(appId: number, ids: number[]) {
    const productAddons = await this.repo
      .createQueryBuilder('product_addon')
      .where('(application.id = :id) AND (product_addon.id IN (:...ids))', {
        id: appId,
        ids: ids,
      })
      .leftJoinAndSelect('product_addon.application', 'application')
      .getMany();
    return productAddons;
  }

  findByName(name: string, appId: number) {
    return this.repo.find({ where: { name, application: { id: appId } } });
  }

  async remove(id: number, appId: number) {
    const productAddon = await this.findOneByApplication(id, appId);
    if (!productAddon) {
      throw new NotFoundException(MSG_EXCEPTION.NOT_FOUND_PRODUCT_ADDON);
    }
    return this.repo.remove(productAddon);
  }

  findAllByApplication(appId: number) {
    return this.repo.find({ where: { application: { id: appId } } });
  }

  async findOneByApplication(id: number, appId: number) {
    if (!id || !appId) {
      return null;
    }
    const productAddon = await this.repo.findOne({
      where: { id, application: { id: appId } },
    });
    if (!productAddon) {
      throw new NotFoundException(MSG_EXCEPTION.NOT_FOUND_PRODUCT_ADDON);
    }
    return productAddon;
  }

  async update(id: number, appId: number, prod: UpdateProductAddonDto) {
    const productAddon = await this.findOneByApplication(id, appId);
    if (!productAddon) {
      throw new NotFoundException(MSG_EXCEPTION.NOT_FOUND_PRODUCT_ADDON);
    }
    Object.assign(productAddon, prod);
    return this.repo.save(productAddon);
  }
}
