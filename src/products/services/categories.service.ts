/* eslint-disable prettier/prettier */
import { forwardRef, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Category } from '../entities/category.entity';
import { Repository } from 'typeorm';
import { ApplicationsService } from 'src/applications/services/applications.service';
import { CreateCategoryDto } from '../dtos/create-category.dto';
import { MSG_EXCEPTION } from 'src/common/constants/messages';
import { UpdateCategoryDto } from '../dtos/update-category.dto';
import { ProductService } from './products.service';

@Injectable()
export class CategoriesService {
  constructor(
    @InjectRepository(Category) private repo: Repository<Category>,
    private applicationsService: ApplicationsService,
    @Inject(forwardRef(() => ProductService))
    private productsService: ProductService,
  ) {}

  async create(categoryData: CreateCategoryDto, applicationId: number) {
    const application = await this.applicationsService.findOne(applicationId);
    if (!application) {
      throw new NotFoundException(MSG_EXCEPTION.NOT_FOUND_APPLICATION);
    }
    const category = this.repo.create(categoryData);
    category.application = application;
    return this.repo.save(category);
  }

  findOne(id: number) {
    if (!id) {
      return null;
    }
    const category = this.repo.findOneBy({ id });
    return category;
  }

  async findOneByApplication(id: number, appId: number) {
    if (!id || !appId) {
      return null;
    }
    const category = await this.repo.findOne({
      where: { id, application: { id: appId } },
      relations: { application: true, products: true },
    });
    if (!category) {
      throw new NotFoundException(MSG_EXCEPTION.NOT_FOUND_CATEGORY);
    }
    return category;
  }

  findByName(name: string, appId: number) {
    return this.repo.find({ where: { name, application: { id: appId } } });
  }

  async remove(id: number, appId: number) {
    if (!id || !appId) {
      return null;
    }
    const category = await this.findOneByApplication(id, appId);
    if (!category) {
      throw new NotFoundException(MSG_EXCEPTION.NOT_FOUND_CATEGORY);
    }

    await this.productsService.findAndRemoveCategory(category.id);

    return this.repo.remove(category);
  }

  findAllByApplication(appId: number) {
    if (!appId) {
      return null;
    }
    const categories = this.repo.find({
      where: { application: { id: appId } },
      relations: { products: true },
    });
    if (!categories) {
      throw new NotFoundException(MSG_EXCEPTION.NOT_FOUND_CATEGORY);
    }
    return categories;
  }

  async update(id: number, appId: number, prod: UpdateCategoryDto) {
    const category = await this.findOneByApplication(id, appId);
    if (!category) {
      throw new NotFoundException(MSG_EXCEPTION.NOT_FOUND_CATEGORY);
    }
    Object.assign(category, prod);
    return this.repo.save(category);
  }
}
