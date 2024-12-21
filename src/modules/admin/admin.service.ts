import { BadRequestException, Injectable } from '@nestjs/common';
import { GetOverviewDashboardDto } from './dtos/get-overview-dashboard.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../user/entity/user.entity';
import { And, LessThan, MoreThanOrEqual, Repository } from 'typeorm';
import { Order } from '../order/entity/order.entity';
import { toFixed } from 'src/common/utilities/base-response';
import { Product } from '../product/entity/product.entity';
import { Category, CATEGORY_MODEL } from '../category/entity/category.entity';

@Injectable()
export class AdminService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(Order)
    private orderRepository: Repository<Order>,
    @InjectRepository(Product)
    private productRepository: Repository<Product>,
    @InjectRepository(Category)
    private categoryRepository: Repository<Category>,
  ) {}

  async getOverviewDashboard(getOverviewDashboardInput: GetOverviewDashboardDto) {
    const { startDate, endDate } = getOverviewDashboardInput;
    if (new Date(startDate).getTime() >= new Date(endDate).getTime()) {
      throw new BadRequestException('start date cannot be greater than endDate');
    }
    const diff = new Date(endDate).getTime() - new Date(startDate).getTime();

    const preStartDate = new Date(new Date(startDate).getTime() - diff);

    const [userStats, orderStats, revenue, productStats] = await Promise.all([
      this.getUserStats({
        endDate,
        preStartDate,
        startDate,
      }),
      this.getPurchaseOrderStats({
        endDate,
        preStartDate,
        startDate,
      }),
      this.getRevenueStats({
        endDate,
        preStartDate,
        startDate,
      }),
      this.getProductStats({
        endDate,
        preStartDate,
        startDate,
      }),
    ]);
    return { revenue, userStats, orderStats, productStats };
  }

  async getProductStats({ endDate, preStartDate, startDate }: { startDate: Date; endDate: Date; preStartDate: Date }) {
    const [newProduct, previousProduct] = await Promise.all([
      await this.productRepository.count({
        where: {
          created_at: And(MoreThanOrEqual(startDate), LessThan(endDate)),
        },
      }),
      await this.productRepository.count({
        where: {
          created_at: And(MoreThanOrEqual(preStartDate), LessThan(startDate)),
        },
      }),
    ]);
    const growthProduct = newProduct - previousProduct / previousProduct;

    return {
      growth: growthProduct ? toFixed(growthProduct * 100) : 0,
      total: newProduct,
    };
  }

  async getPurchaseOrderStats({
    startDate,
    endDate,
    preStartDate,
  }: {
    startDate: Date;
    endDate: Date;
    preStartDate: Date;
  }) {
    const [currentOrder, previousOrder] = await Promise.all([
      await this.orderRepository.count({
        where: {
          created_at: And(MoreThanOrEqual(startDate), LessThan(endDate)),
        },
      }),
      await this.orderRepository.count({
        where: {
          created_at: And(MoreThanOrEqual(preStartDate), LessThan(startDate)),
        },
      }),
    ]);
    const growthOrder = currentOrder - previousOrder / currentOrder;

    return {
      growth: growthOrder ? toFixed(growthOrder * 100) : 0,
      total: currentOrder,
    };
  }

  async getUserStats({ startDate, endDate, preStartDate }: { startDate: Date; endDate: Date; preStartDate: Date }) {
    const [currentNewUser, previousUser] = await Promise.all([
      await this.userRepository.count({
        where: {
          created_at: And(MoreThanOrEqual(startDate), LessThan(endDate)),
        },
      }),
      await this.userRepository.count({
        where: {
          created_at: And(MoreThanOrEqual(preStartDate), LessThan(startDate)),
        },
      }),
    ]);
    const growthUser = currentNewUser - previousUser / previousUser;

    return {
      growth: growthUser ? toFixed(growthUser * 100) : 0,
      total: currentNewUser,
    };
  }

  async getRevenueStats({ startDate, endDate, preStartDate }: { startDate; endDate; preStartDate }) {
    // TODO subtract discount
    const [order, previousOrder] = await Promise.all([
      await this.orderRepository
        .createQueryBuilder('orders')
        .select('SUM(orders.quantity * orders.price)', 'sum')
        .where('orders.created_at >= :startDate AND orders.created_at < :endDate', {
          startDate,
          endDate,
        })
        .getRawMany(),
      await this.orderRepository
        .createQueryBuilder('orders')
        .select('SUM(orders.quantity * orders.price)', 'sum')
        .where('orders.created_at >= :preStartDate AND orders.created_at < :startDate', {
          preStartDate,
          startDate,
        })
        .getRawMany(),
    ]);
    const revenue = Number(order[0].sum ?? 0);
    const previousRevenue = Number(previousOrder[0].sum ?? 0);
    const growthRevenue = revenue - previousRevenue / previousRevenue;
    return {
      growth: toFixed(growthRevenue ? growthRevenue * 100 : 0),
      total: toFixed(revenue),
    };
  }

  async getCategoryStats() {}
}
