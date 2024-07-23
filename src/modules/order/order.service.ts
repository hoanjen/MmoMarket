import { BadRequestException, HttpStatus, Injectable } from '@nestjs/common';
import { BuyVansProductDto } from './dtos/buy-vans-product.dto';
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';
import { Discount } from './entity/discount.entity';
import { DataSource, In, Repository } from 'typeorm';
import { Order } from './entity/order.entity';
import { VansProductService } from '../product/vans-product.service';
import { DataProductOrder } from './entity/data-product-order.entity';
import { ReturnCommon } from 'src/common/utilities/base-response';
import { EResponse } from 'src/common/interface.common';


@Injectable()
export class OrderService {
  constructor(
    @InjectRepository(Discount)
    private readonly discountRepository: Repository<Discount>,
    @InjectRepository(Order)
    private readonly orderRepository: Repository<Order>,
    @InjectRepository(DataProductOrder)
    private readonly dataProductOrderRepository: Repository<DataProductOrder>,
    @InjectDataSource()
    private readonly dataSource: DataSource,
    private readonly vansProductService: VansProductService,
  ) {}


  async createOrder(req: any, buyVansProductInput: BuyVansProductDto) {
    let { discount_id, vans_product_id, quantity } = buyVansProductInput;
    let isDiscount;
    if (discount_id) {
      try {
        isDiscount = await this.discountRepository.findOne({
          where: { id: discount_id },
        });
      } catch (error) {
        throw new BadRequestException('discount_id is invalid !!');
      }
    }
    const checkVansProduct = await this.vansProductService.getVansProduct(vans_product_id);

    if (!checkVansProduct) {
      throw new BadRequestException('vans_product_id invalid !!');
    }

    const queryRunner = this.dataSource.createQueryRunner();

    await queryRunner.connect();

    try {
      await queryRunner.startTransaction();

      const data_products = await this.vansProductService.getDataProduct(
        {vans_product_id,quantity},
        queryRunner
      );

      const newOrder = this.orderRepository.create({
        vans_product_id,
        user_id: req.user.sub,
        discount_id: discount_id === '' ? null : discount_id,
      });
      const order = await queryRunner.manager.save(newOrder);
      
      const newDataProductOrders = data_products.map((item) => ({
        order_id: order.id,
        data_product_id: item.id,
      }));
      await queryRunner.manager.insert(DataProductOrder,newDataProductOrders);
      

      await queryRunner.commitTransaction();
      await queryRunner.release();
      return ReturnCommon({
        data: {
          order_id: order.id,
        },
        message: 'You have successfully ordered, please check your order',
        statusCode: HttpStatus.OK,
        status: EResponse.SUCCESS,
      });
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    }
  }

  async isBuyProduct(product_id: string, user_id: string) {
    const orders = await this.orderRepository.find({ where: { user_id } });

    const vans_product_ids = new Set();
    orders.forEach((item) => {
      vans_product_ids.add(item.vans_product_id);
    });
    const vansProduct = await this.vansProductService.getVansProductIdByProductId(product_id);
    for(let i = 0; i < vansProduct.length; i++){
      if (vans_product_ids.has(vansProduct[i].id)) {
        return true;
      }
    }
    return false;
  }
}
