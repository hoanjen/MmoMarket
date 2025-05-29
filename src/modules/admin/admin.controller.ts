import { Controller, Delete, Get, Param, Patch, Post, Query } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { IsPublic, Role, Roles } from 'src/common/decorators/decorator.common';
import { AdminService } from './admin.service';
import { GetOverviewDashboardDto } from './dtos/get-overview-dashboard.dto';
import { GetListUserDto } from './dtos/get-list-user.dto';
import { GetHistoryDto, GetListProductDto } from './dtos/get-list-product.dto';

@ApiTags('Admin')
@Roles(Role.Admin)
@ApiBearerAuth()
@Controller('admin')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}
  @Get('dashboard/overview')
  @ApiOperation({ summary: 'overview' })
  async getOverviewDashboard(@Query() getOverviewDashboardInput: GetOverviewDashboardDto) {
    return this.adminService.getOverviewDashboard(getOverviewDashboardInput);
  }

  @Get('dashboard/category-stats')
  @ApiOperation({ summary: 'group category type by category' })
  async getCategoryStats() {
    return this.adminService.getCategoryStats();
  }

  @Get('order/revenue')
  @ApiOperation({ summary: 'Revenue by year' })
  async getOrderRevenue() {
    return this.adminService.getOrderRevenue();
  }

  @Get('users')
  @ApiOperation({ summary: 'list user' })
  async getListUser(@Query() getListUserInput: GetListUserDto) {
    return this.adminService.getListUser(getListUserInput);
  }

  @Patch('users/:id')
  @ApiOperation({ summary: 'kick user' })
  async kickUser(@Param('id') id: string) {
    return this.adminService.kickUser(id);
  }

  @Get('products')
  @ApiOperation({ summary: 'list product' })
  async getListProduct(@Query() getListProductInput: GetListProductDto) {
    return this.adminService.getListProduct(getListProductInput);
  }
  @Delete('products/:id')
  @ApiOperation({ summary: 'delete product' })
  async deleteProduct(@Param('id') id: string) {
    return this.adminService.deleteProduct(id);
  }

  @Get('reports')
  @ApiOperation({ summary: 'list report' })
  async getListReport() {
    return this.adminService.getListReport();
  }

  @Get('history-payment')
  @ApiOperation({ summary: 'list payment' })
  async getHistoryPayment(@Query() getHistoryInput: GetHistoryDto) {
    return this.adminService.historyPayment(getHistoryInput);
  }

  @Post('return-money-for-user')
  @ApiOperation({ summary: 'Return money for user by admin' })
  async returnMoneyForUserByAdmin(@Query() order_id: string) {
    return this.adminService.returnMoneyForUserByAdmin(order_id);
  }

  @Post('return-money-for-merchent')
  @ApiOperation({ summary: 'Return money for merchant by admin' })
  async returnMoneyForMerchantByAdmin(@Query() order_id: string) {
    return this.adminService.returnMoneyForMerchantByAdmin(order_id);
  }
}
