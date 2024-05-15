import { HttpStatus, Injectable } from '@nestjs/common';
import { Category } from './entity/category.entity';
import { CategoryType } from './entity/category-type.entity';
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { ReturnCommon } from 'src/common/utilities/base-response';
import { EResponse } from 'src/common/interface.common';
import { CreateCategoryDto } from './dtos/create-category.dto';
import { CreateCategoryTypeDto } from './dtos/create-categorytype.dto';
import { GetCategoryDto } from './dtos/get-category.dto';
import { GetProductOfCategoryTypeDto } from './dtos/get-product-of-categorytype.dto';
import { GetCategoryTypeDto } from './dtos/get-categoryType.dto';

@Injectable()
export class CategoryService {
  constructor(
    @InjectRepository(Category)
    private categoryRepository: Repository<Category>,
    @InjectRepository(CategoryType)
    private categoryTypeRepository: Repository<CategoryType>,
    @InjectDataSource()
    private dataSource: DataSource,
  ) {}

  async findCategoryById(id: string) {
    return await this.categoryRepository.findOne({ where: { id } });
  }

  async findCategoryTypeById(id: string) {
    return await this.categoryTypeRepository.findOne({ where: { id } });
  }

  async getCategory(getCategoryInput: GetCategoryDto) {
    const { populate, limit, page, category_id } = getCategoryInput;
    let results;
    if (category_id) {
      results = await this.categoryRepository.findOne({
        where: { id: category_id },
      });
    } else {
      const limitNumber = limit;
      const pageNumber = page;
      const skip = (pageNumber - 1) * limitNumber;
      if (populate == 'CategoryType') {
        results = await this.categoryRepository.find({
          relations: {
            category_types: true,
          },
          take: limitNumber,
          skip: skip,
        });
      } else {
        results = await this.categoryRepository.find({
          take: limitNumber,
          skip: skip,
        });
      }
    }

    return ReturnCommon({
      statusCode: HttpStatus.OK,
      status: EResponse.SUCCESS,
      data: {
        results,
      },
      message: 'Get category successfully !!',
    });
  }

  

  async createCategory(createCategoryInput: CreateCategoryDto) {
    const { name } = createCategoryInput;
    console.log(1111);
    const newCategory = this.categoryRepository.create({ name });

    await this.categoryRepository.save(newCategory);

    return ReturnCommon({
      statusCode: HttpStatus.CREATED,
      status: EResponse.SUCCESS,
      data: {
        newCategory,
      },
      message: 'Create category successfully !!',
    });
  }

  

  
}
