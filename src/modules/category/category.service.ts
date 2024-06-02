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
import { TypeCategory } from './category.constant';

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
  async getCategoryOption(
    limit?: number,
    page?: number,
    category_id?: string,
  ) {
    let results;
    if (category_id) {
      results = await this.categoryRepository.findOne({
        where: { id: category_id },
      });
    } else {
      const vlimit = limit ? limit : 100;
      const vpage = page ? page : 1;
      const skip = (vpage - 1) * vlimit;

      const [result, total] = await this.categoryRepository.findAndCount({
        take: vlimit,
        skip: skip,
        relations: {
          category_types: true
        }
      });
      const totalPages = Math.ceil(total / vlimit);
      const nextPage = vpage < totalPages ? vpage + 1 : null;
      const previousPage = vpage > 1 ? vpage - 1 : null;
      results = result;
      return { results, previousPage, totalPages, nextPage };
    }
    return {results};
  }
  async getCategory(getCategoryInput: GetCategoryDto) {
    
    const categoryService = this.categoryRepository.find({where: {type: TypeCategory.SERVICE}});
    const categoryProduct = this.categoryRepository.find({where: {type: TypeCategory.PRODUCT}});

    const results = await Promise.all([categoryProduct,categoryService]);
    return ReturnCommon({
      statusCode: HttpStatus.OK,
      status: EResponse.SUCCESS,
      data: {
        categoryProduct: results[0],
        categoryService: results[1],
      },
      message: 'Get category successfully !!',
    });
  }

  async createCategory(createCategoryInput: CreateCategoryDto) {
    const { name, type } = createCategoryInput;
    const newCategory = this.categoryRepository.create({ name, type });

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
