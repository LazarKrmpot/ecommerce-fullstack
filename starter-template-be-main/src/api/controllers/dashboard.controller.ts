import { Roles } from 'api/models/user.model';
import { OrderService } from 'api/services/order.service';
import { ProductService } from 'api/services/product.service';
import { UserService } from 'api/services/user.service';
import { IsNumber, ValidateNested } from 'class-validator';
import { Authorized, Get, JsonController } from 'routing-controllers';
import { ResponseSchema } from 'routing-controllers-openapi';

class ProductsStats {
  @IsNumber()
  total: number;

  @IsNumber()
  lowStock: number;

  @IsNumber()
  outOfStock: number;
}

class OrdersStats {
  @IsNumber()
  total: number;

  @IsNumber()
  pending: number;

  @IsNumber()
  completed: number;

  @IsNumber()
  cancelled: number;

  @IsNumber()
  productsSold: number;
}

class UsersStats {
  @IsNumber()
  total: number;
}

class OverviewResponse {
  @ValidateNested()
  products: ProductsStats;

  @ValidateNested()
  orders: OrdersStats;

  @ValidateNested()
  users: UsersStats;

  @ValidateNested()
  revenue: number;
}

class ProductsAnalytics {
  @IsNumber()
  inStockPercentage: number;
  @IsNumber()
  outOfStockPercentage: number;
}

class OrdersAnalytics {
  @IsNumber()
  pendingPercentage: number;
  @IsNumber()
  acceptedPercentage: number;
  @IsNumber()
  processingPercentage: number;
  @IsNumber()
  shippedPercentage: number;
  @IsNumber()
  rejectedPercentage: number;
  @IsNumber()
  completedPercentage: number;
  @IsNumber()
  cancelledPercentage: number;
}

class UsersAnalytics {
  @IsNumber()
  usersWithAccount: number;
}

class AnalyticsResponse {
  @ValidateNested()
  products: ProductsAnalytics;

  @ValidateNested()
  orders: OrdersAnalytics;

  @ValidateNested()
  users: UsersAnalytics;
}

@JsonController('/dashboard')
export class DashboardController {
  constructor(
    private productService: ProductService,
    private orderService: OrderService,
    private userService: UserService,
  ) {}

  @Get('/overview')
  @ResponseSchema(OverviewResponse)
  @Authorized(Roles.ADMIN)
  public async getDashboardOverview() {
    const [productOverView, orderOverView, userOverView] = await Promise.all([
      this.getProductSummary(),
      this.getOrderSummary(),
      this.getUserSummary(),
    ]);

    return {
      data: {
        products: productOverView,
        orders: orderOverView,
        users: userOverView,
        revenue: await this.getRevenueSummary(),
      },
      message: 'Dashboard overview retrieved successfully',
    };
  }

  private async getProductSummary() {
    const stats = await this.productService.aggregate([
      {
        $facet: {
          total: [{ $count: 'count' }],
          lowStock: [{ $match: { stock: { $lt: 5 } } }, { $count: 'count' }],
          outOfStock: [{ $match: { stock: 0 } }, { $count: 'count' }],
        },
      },
    ]);

    return {
      total: stats[0].total[0]?.count || 0,
      lowStock: stats[0].lowStock[0]?.count || 0,
      outOfStock: stats[0].outOfStock[0]?.count || 0,
    };
  }

  private async getOrderSummary() {
    const stats = await this.orderService.aggregate([
      {
        $facet: {
          total: [{ $count: 'count' }],
          pending: [{ $match: { status: 'pending' } }, { $count: 'count' }],
          completed: [{ $match: { status: 'delivered' } }, { $count: 'count' }],
          cancelled: [{ $match: { status: 'cancelled' } }, { $count: 'count' }],
          productsSold: [
            { $match: { status: 'delivered' } },
            { $unwind: '$orderedItems' },
            {
              $group: {
                _id: null,
                count: { $sum: { $ifNull: ['$orderedItems.quantity', 0] } },
              },
            },
          ],
        },
      },
    ]);

    return {
      total: stats[0].total[0]?.count || 0,
      pending: stats[0].pending[0]?.count || 0,
      completed: stats[0].completed[0]?.count || 0,
      cancelled: stats[0].cancelled[0]?.count || 0,
      productsSold: stats[0].productsSold[0]?.count || 0,
    };
  }
  // ...existing code...

  public async getUserSummary() {
    const stats = await this.userService.aggregate([
      {
        $facet: {
          total: [{ $count: 'count' }],
        },
      },
    ]);
    return {
      total: stats[0].total[0]?.count || 0,
    };
  }

  public async getRevenueSummary() {
    const stats = await this.orderService.aggregate([
      {
        $match: { status: 'delivered' },
      },
      {
        $group: {
          _id: null,
          totalRevenue: { $sum: '$priceToPay' },
        },
      },
    ]);

    return stats[0]?.totalRevenue || 0;
  }

  @Get('/analytics')
  @ResponseSchema(AnalyticsResponse)
  @Authorized(Roles.ADMIN)
  public async getAnalytics() {
    const [productStats, orderStats, userStats] = await Promise.all([
      this.getProductAnalytics(),
      this.getOrderAnalytics(),
      this.getUserAnalytics(),
    ]);
    return {
      message: 'Analytics retrieved successfully',
      data: {
        products: productStats,
        orders: orderStats,
        users: userStats,
      },
    };
  }

  public async getProductAnalytics() {
    const stats = await this.productService.aggregate([
      {
        $facet: {
          total: [{ $count: 'count' }],
          outOfStock: [{ $match: { stock: 0 } }, { $count: 'count' }],
          inStock: [{ $match: { stock: { $gt: 0 } } }, { $count: 'count' }],
        },
      },
    ]);

    const total = stats[0].total[0]?.count || 0;
    const outOfStock = stats[0].outOfStock[0]?.count || 0;
    const inStock = stats[0].inStock[0]?.count || 0;

    const inStockPercentage = total > 0 ? (inStock / total) * 100 : 0;
    const outOfStockPercentage = total > 0 ? (outOfStock / total) * 100 : 0;

    return {
      inStockPercentage,
      outOfStockPercentage,
    };
  }

  public async getOrderAnalytics() {
    const stats = await this.orderService.aggregate([
      {
        $facet: {
          total: [{ $count: 'count' }],
          pending: [{ $match: { status: 'pending' } }, { $count: 'count' }],
          accepted: [{ $match: { status: 'accepted' } }, { $count: 'count' }],
          processing: [
            { $match: { status: 'processing' } },
            { $count: 'count' },
          ],
          shipped: [{ $match: { status: 'shipped' } }, { $count: 'count' }],
          rejected: [{ $match: { status: 'rejected' } }, { $count: 'count' }],
          completed: [{ $match: { status: 'delivered' } }, { $count: 'count' }],
          cancelled: [{ $match: { status: 'cancelled' } }, { $count: 'count' }],
        },
      },
    ]);

    const total = stats[0].total[0]?.count || 0;
    const pending = stats[0].pending[0]?.count || 0;
    const accepted = stats[0].accepted[0]?.count || 0;
    const processing = stats[0].processing[0]?.count || 0;
    const shipped = stats[0].shipped[0]?.count || 0;
    const rejected = stats[0].rejected[0]?.count || 0;
    const completed = stats[0].completed[0]?.count || 0;
    const cancelled = stats[0].cancelled[0]?.count || 0;

    const pendingPercentage = total > 0 ? (pending / total) * 100 : 0;
    const acceptedPercentage = total > 0 ? (accepted / total) * 100 : 0;
    const processingPercentage = total > 0 ? (processing / total) * 100 : 0;
    const shippedPercentage = total > 0 ? (shipped / total) * 100 : 0;
    const rejectedPercentage = total > 0 ? (rejected / total) * 100 : 0;
    const completedPercentage = total > 0 ? (completed / total) * 100 : 0;
    const cancelledPercentage = total > 0 ? (cancelled / total) * 100 : 0;

    return {
      pendingPercentage,
      acceptedPercentage,
      processingPercentage,
      shippedPercentage,
      rejectedPercentage,
      completedPercentage,
      cancelledPercentage,
    };
  }

  public async getUserAnalytics() {
    const stats = await this.orderService.aggregate([
      {
        $facet: {
          usersWithAccount: [
            { $match: { orderedByUser: { $exists: true, $ne: null } } },
            { $group: { _id: '$orderedByUser' } },
            { $count: 'count' },
          ],
        },
      },
    ]);

    const usersWithAccount = stats[0].usersWithAccount[0]?.count || 0;

    return {
      usersWithAccount,
    };
  }
}
