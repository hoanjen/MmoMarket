import { HttpStatus, Injectable } from '@nestjs/common';
import { Category } from './enity/category.entity';
import { CategoryType } from './enity/category-type.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ReturnCommon } from 'src/common/utilities/base-response';
import { EResponse } from 'src/common/interface.common';
@Injectable()
export class CategoryService {
  constructor(
    @InjectRepository(Category)
    private categoryRepository: Repository<Category>,
    @InjectRepository(CategoryType)
    private categoryTypeRepository: Repository<CategoryType>,
  ) {}
  async getCategory() {
    const categoryList = await this.categoryTypeRepository
      .createQueryBuilder('categoryType')
      .innerJoin('categoryType.category', 'category')
      .getMany();
    return ReturnCommon({
      statusCode: HttpStatus.OK,
      status: EResponse.SUCCESS,
      message: 'Get category complete !',
      data: categoryList
    });
  }

  async createCategory() {}

  async createSubCategory() {}
}
