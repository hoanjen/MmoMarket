import { Controller, Get, Query } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { IsPublic, Role, Roles } from 'src/common/decorators/decorator.common';
import { AdminService } from './admin.service';
import { GetOverviewDashboardDto } from './dtos/get-overview-dashboard.dto';
import { GetListUserDto } from './dtos/get-list-user.dto';

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
}
