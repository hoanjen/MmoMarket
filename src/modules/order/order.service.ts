import { BadRequestException, Injectable } from '@nestjs/common';
import { BuyVansProductDto } from './dtos/buy-vans-product.dto';
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';
import { Discount } from './entity/discount.entity';
import { DataSource, Repository } from 'typeorm';
import { Order } from './entity/order.entity';
import { VansProductService } from '../product/vans-product.service';

@Injectable()
export class OrderService {
  constructor(
    @InjectRepository(Discount)
    private readonly discountRepository: Repository<Discount>,
    @InjectRepository(Order)
    private readonly orderRepository: Repository<Order>,
    @InjectDataSource()
    private readonly dataSource: DataSource,
    private readonly vansProductService: VansProductService
  ) {}

  async isVansProduct(orders: Array<any>){
    const promiseCheck = []
    orders.forEach((item) => {
      const promise = this.vansProductService.getVansProduct(item.vans_product_id);
      promiseCheck.push(promise);
    })

    const vansProducts = await Promise.all(promiseCheck);
    let check = false;
    vansProducts.forEach((item) => {
      if(item === null){
        check = true;
        return ;
      }
    })
    return check;
  }


  async createOrder(req: any, buyVansProductInput: BuyVansProductDto) {
    const { discount_id, orders } = buyVansProductInput;
    if (discount_id) {
      const isDiscount = await this.discountRepository.findOne({
        where: { id: discount_id },
      });
      if (!isDiscount) {
        throw new BadRequestException('discount_id is invalid !!');
      }
    }
    const checkVansProduct = await this.isVansProduct(orders);
    
    if(checkVansProduct){
      throw new BadRequestException('vans_product_id invalid !!');
    }

    const queryRunner = this.dataSource.createQueryRunner();

    await queryRunner.connect();

    try {
      await queryRunner.startTransaction();
      const a = await this.vansProductService.updateQuantityDataProduct(
        '2a4de8b8-8949-48e4-a89e-ccafc8f469ae'
      );
      
      // const newOrder = this.orderRepository.create({
      //   user_id: req.user.user_id,
      //   discount_id:
      // });
      // this.dataSource.manager.save()
      // await this.orderRepository.save(newOrder);

      await queryRunner.commitTransaction();
      await queryRunner.release();
    } catch (error) {
      await queryRunner.rollbackTransaction();
    }
  }
}
