import { BadRequestException, Injectable } from '@nestjs/common';
import { GetOverviewDashboardDto } from './dtos/get-overview-dashboard.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../user/entity/user.entity';
import { And, ILike, LessThan, MoreThanOrEqual, Repository } from 'typeorm';
import { Order } from '../order/entity/order.entity';
import { pagination, toFixed } from 'src/common/utilities/base-response';
import { Product } from '../product/entity/product.entity';
import { Category, CATEGORY_MODEL } from '../category/entity/category.entity';
import { GetListUserDto } from './dtos/get-list-user.dto';
import { mapMonth } from './type';
import { Role } from '../user/entity/role.entity';
import { USER_ROLE } from '../user/user.constant';

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
    @InjectRepository(Role)
    private roleRepository: Repository<Role>,
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
    const growthProduct = (newProduct - previousProduct) / previousProduct;

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
    const growthRevenue = (revenue - previousRevenue) / previousRevenue;
    return {
      growth: toFixed(growthRevenue ? growthRevenue * 100 : 0),
      total: toFixed(revenue),
    };
  }

  // { label: 'America', value: 3500 },
  // { label: 'Asia', value: 2500 },
  // { label: 'Europe', value: 1500 },
  // { label: 'Africa', value: 500 },

  async getCategoryStats() {
    const results = await this.categoryRepository
      .createQueryBuilder('category')
      .leftJoinAndSelect('category.category_types', 'categoryType')
      .select('category.name', 'categoryName')
      .addSelect('COUNT(categoryType.id)', 'categoryTypeCount')
      .groupBy('category.id')
      .getRawMany();
    if (!results.length) {
      return {
        label: 'category',
        value: 1,
      };
    }
    return results.map((item) => {
      return {
        label: item.categoryName,
        value: Number(item.categoryTypeCount),
      };
    });
  }

  async getListUser(getListUserInput: GetListUserDto) {
    const { limit, page, search } = getListUserInput;
    const vLimit = limit && limit > 0 ? limit : 10;
    const vPage = page && page > 0 ? page : 1;
    const offset = (vPage - 1) * vLimit;
    const user = await this.userRepository.find({
      where: search
        ? [
            {
              email: ILike(`%${search}%`),
            },
            {
              full_name: ILike(`%${search}%`),
            },
          ]
        : {},
      relations: {
        roles: true,
      },
      skip: offset,
      take: vLimit,
    });
    const totalUser = await this.userRepository.count({
      where: search
        ? [
            {
              email: ILike(`%${search}%`),
            },
            {
              full_name: ILike(`%${search}%`),
            },
          ]
        : {},
    });

    const pageDetail = pagination(vPage, vLimit, totalUser);
    return {
      pageDetail,
      user,
    };
  }

  async getOrderRevenue() {
    const year = new Date().getFullYear();

    const [preRevenue, revenue] = await Promise.all([
      await this.orderRepository
        .createQueryBuilder('orders')
        .select([`SUM(orders.quantity * orders.price) AS revenue`])
        .where(`EXTRACT(YEAR FROM orders.created_at) = :year`, { year: year - 1 })
        .getRawOne(),
      await this.orderRepository
        .createQueryBuilder('orders')
        .select([`EXTRACT(MONTH FROM orders.created_at) AS month`, `SUM(orders.quantity * orders.price) AS revenue`])
        .where(`EXTRACT(YEAR FROM orders.created_at) = :year`, { year })
        .groupBy(`EXTRACT(MONTH FROM orders.created_at)`)
        .getRawMany(),
    ]);

    let sumRevenue = 0;
    const results = [];
    const mapRevenue = new Map<string, number>();

    for (const item of revenue) {
      mapRevenue.set(item.month, item.revenue);
    }

    mapMonth.forEach((value, key) => {
      const isExistedMonth = mapRevenue.get(key);
      sumRevenue += isExistedMonth ?? 0;
      if (isExistedMonth) {
        results.push({
          month: value,
          revenue: isExistedMonth,
        });
      } else {
        results.push({
          month: value,
          revenue: 0,
        });
      }
    });

    const growthRevenue = (sumRevenue - preRevenue) / preRevenue;

    return { growthRevenue: growthRevenue ? toFixed(growthRevenue) : 0, revenue: results };
  }

  async kickUser(id: string) {
    const role = await this.roleRepository.findOne({
      where: {
        user_id: id,
      },
    });

    if (!role) {
      throw new BadRequestException('User not found');
    }
    if (role.name === USER_ROLE.ADMIN) {
      throw new BadRequestException('Cannot kick admin');
    }
    await this.roleRepository.update(
      {
        user_id: id,
      },
      {
        name: role.name === USER_ROLE.KICK ? USER_ROLE.USER : USER_ROLE.KICK,
      },
    );
    return 'Ok';
  }
}
