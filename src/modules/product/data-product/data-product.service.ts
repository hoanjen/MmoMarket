import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataProduct } from '../entity/data-product.entity';
import { Repository } from 'typeorm';
import { UpdateDataProductDto } from './dtos/update-data-product';
import { StatusProductSale } from '../product.constant';

@Injectable()
export class DataProductService {
  constructor(
    @InjectRepository(DataProduct)
    private readonly dataProductRepository: Repository<DataProduct>,
  ) {}

  async updateDataProduct(user_id: string, data: UpdateDataProductDto, id: string) {
    //TODO check permission
    const result = await this.dataProductRepository
      .createQueryBuilder('dataProduct')
      .leftJoin('dataProduct.vans_product', 'vansProduct')
      .leftJoin('vansProduct.product', 'product')
      .where('dataProduct.id = :dataProductId', { dataProductId: id })
      .andWhere('product.user_id = :userId', { userId: user_id })
      .getOne();

    if (!result) {
      throw new BadRequestException('Data product not found');
    }

    return await this.dataProductRepository.update(id, { ...data });
  }

  async deleteDataProduct(user_id: string, id: string) {
    const result = await this.dataProductRepository
      .createQueryBuilder('dataProduct')
      .leftJoin('dataProduct.vans_product', 'vansProduct')
      .leftJoin('vansProduct.product', 'product')
      .where('dataProduct.id = :dataProductId', { dataProductId: id })
      .andWhere('product.user_id = :userId', { userId: user_id })
      .getOne();

    if (!result) {
      throw new BadRequestException('Data product not found');
    }

    return await this.dataProductRepository.delete({ id, status: StatusProductSale.NOTSOLD });
  }
}
