import { Controller, Get, Query } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { IsPublic, Role, Roles } from 'src/common/decorators/decorator.common';
import { AdminService } from './admin.service';
import { GetOverviewDashboardDto } from './dtos/get-overview-dashboard.dto';

@ApiTags('Admin')
@Roles(Role.Admin)
@ApiBearerAuth()
@IsPublic()
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
}
