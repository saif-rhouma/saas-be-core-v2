/* eslint-disable prettier/prettier */
import { Body, Controller, Delete, Get, NotFoundException, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { MSG_EXCEPTION } from 'src/common/constants/messages';
import { GetUser } from 'src/common/decorators/getUser.decorator';
import { AuthenticationGuard } from 'src/common/guards/authentication.guard';
import getApplicationId from 'src/common/helpers/application-id.func';
import { User } from 'src/users/entities/user.entity';
import { CreateCategoryDto } from '../dtos/create-category.dto';
import { UpdateCategoryDto } from '../dtos/update-category.dto';
import { CategoriesService } from '../services/categories.service';

@Controller('categories')
export class CategoriesController {
  constructor(private categoriesService: CategoriesService) {}

  @UseGuards(AuthenticationGuard)
  @Post('/create')
  async createCategory(@Body() categoryData: CreateCategoryDto, @GetUser() user: Partial<User>) {
    const appId = getApplicationId(user);
    return this.categoriesService.create(categoryData, appId);
  }

  @UseGuards(AuthenticationGuard)
  @Delete('/:id')
  async removeCategory(@Param('id') id: string, @GetUser() user: Partial<User>) {
    const appId = getApplicationId(user);
    return this.categoriesService.remove(parseInt(id), appId);
  }

  @UseGuards(AuthenticationGuard)
  @Get('/:id')
  async findCategory(@Param('id') id: string, @GetUser() user: Partial<User>) {
    const appId = getApplicationId(user);
    const category = await this.categoriesService.findOneByApplication(parseInt(id), appId);
    if (!category) {
      throw new NotFoundException(MSG_EXCEPTION.NOT_FOUND_CATEGORY);
    }
    return category;
  }

  @UseGuards(AuthenticationGuard)
  @Get()
  async findAllCategories(@GetUser() user: Partial<User>) {
    const appId = getApplicationId(user);
    return this.categoriesService.findAllByApplication(appId);
  }

  @UseGuards(AuthenticationGuard)
  @Patch('/:id')
  async updateProduct(
    @Param('id') id: string,
    @Body() updateCategoryDto: UpdateCategoryDto,
    @GetUser() user: Partial<User>,
  ) {
    const appId = getApplicationId(user);
    return this.categoriesService.update(parseInt(id), appId, updateCategoryDto);
  }
}
