import { OmitType, PickType } from '@nestjs/swagger';
import { Ref } from '@typegoose/typegoose';
import { Category } from 'api/models/category.model';
import {
  Order,
  OrderDeliveryAddress,
  OrderStatus,
  OrderedItem,
  ShippingMethod,
} from 'api/models/order.model';
import { Product } from 'api/models/product.model';
import { Shop } from 'api/models/shop.model';
import { DeliveryAddressInfo, Roles, User } from 'api/models/user.model';
import { CategoryService } from 'api/services/category.service';
import { OrderService } from 'api/services/order.service';
import { ProductService } from 'api/services/product.service';
import { FilterQueryParams } from 'api/types/filter.types';
import { Exclude, Type, plainToInstance } from 'class-transformer';
import {
  IsArray,
  IsBoolean,
  IsNumber,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import {
  Authorized,
  Body,
  CurrentUser,
  Delete,
  Get,
  JsonController,
  Param,
  Post,
  Put,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  QueryParams,
} from 'routing-controllers';
import { ResponseSchema } from 'routing-controllers-openapi';

export class CreateOrderBody {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => OrderedItem)
  orderedItems: OrderedItem[];

  @IsString()
  shippingMethod: ShippingMethod;

  @IsOptional()
  @ValidateNested()
  @Type(() => OrderDeliveryAddress)
  deliveryAddress?: OrderDeliveryAddress;

  @IsOptional()
  @IsBoolean()
  usePrimaryAddress?: boolean;
}

class UserResponse extends OmitType(User, [
  '__v',
  'password',
  'deliveryAddresses',
]) {
  @Exclude()
  @IsOptional()
  protected_: null;

  @Exclude()
  __v: number;

  @Exclude()
  password: string;

  @Exclude()
  deliveryAddresses: DeliveryAddressInfo[];

  @Exclude()
  createdAt: Date;

  @Exclude()
  updatedAt: Date;
}

class CategoryResponse extends OmitType(Category, ['__v']) {
  @Exclude()
  @IsOptional()
  protected_: null;

  @Exclude()
  __v: number;

  @Exclude()
  createdAt: Date;

  @Exclude()
  updatedAt: Date;
}

class ProductWithCategory extends OmitType(Product, [
  '__v',
  'categoryId',
  'status',
  'isFeatured',
  'currency',
  'shopId',
]) {
  @Exclude()
  __v: number;

  @Exclude()
  @IsOptional()
  protected_: null;

  @Exclude()
  createdAt: Date;

  @Exclude()
  updatedAt: Date;

  @Exclude()
  status: string;

  @Exclude()
  isFeatured: boolean;

  @Exclude()
  currency: string;

  @Exclude()
  shopId: Ref<Shop>;

  @ValidateNested()
  @Type(() => CategoryResponse)
  categoryId: CategoryResponse;
}

class PopulatedOrderedItem extends OmitType(OrderedItem, ['productId']) {
  @Exclude()
  @IsOptional()
  protected_: null;

  @Type(() => ProductWithCategory)
  @ValidateNested()
  productId: ProductWithCategory;
}

class OrderType extends OmitType(Order, ['orderedItems', 'orderedByUser']) {
  @Exclude()
  @IsOptional()
  protected_: null;

  @ValidateNested()
  @Type(() => UserResponse)
  orderedByUser: UserResponse;

  @ValidateNested({ each: true })
  @Type(() => PopulatedOrderedItem)
  orderedItems: PopulatedOrderedItem[];
}

export class MyOrderType extends OmitType(Order, [
  'orderedItems',
  'orderedByUser',
]) {
  @Exclude()
  @IsOptional()
  protected_: null;

  @Exclude()
  orderedByUser: Ref<User>;

  @ValidateNested({ each: true })
  @Type(() => PopulatedOrderedItem)
  orderedItems: PopulatedOrderedItem;
}

class OrdersResponse {
  @ValidateNested({ each: true })
  @Type(() => OrderType)
  data: OrderType[];

  @Type(() => FilterQueryParams)
  @ValidateNested()
  meta: FilterQueryParams<OrderType[]>;

  @IsString()
  message: string;
}

class MyOrdersResponse {
  @ValidateNested({ each: true })
  @Type(() => MyOrderType)
  data: MyOrderType[];

  @Type(() => FilterQueryParams)
  @ValidateNested()
  meta: FilterQueryParams<MyOrderType[]>;

  @IsString()
  message: string;
}

class UpdateOrderBody extends PickType(Order, ['status', 'shippingMethod']) {
  @Exclude()
  @IsOptional()
  protected _: null;
}

class UpdateOrderResponse {
  @IsString()
  message: string;

  @ValidateNested({ each: true })
  @Type(() => MyOrderType)
  data: MyOrderType[];
}

class OrderStats {
  @IsNumber()
  totalOrders: number;

  @IsNumber()
  newOrders: number;

  @IsNumber()
  completedOrders: number;

  @IsNumber()
  cancelledOrders: number;
}

class OrderStatsResponse {
  @ValidateNested()
  @Type(() => OrderStats)
  data: OrderStats;
}
@JsonController('/orders')
export class OrderController {
  constructor(
    private orderService: OrderService,
    private productService: ProductService,
    private categoryService: CategoryService,
  ) {}

  @Post('/')
  @Authorized(Object.values(Roles))
  public async createOrder(
    @Body() body: CreateOrderBody,
    @CurrentUser() user: User | null,
  ) {
    const { orderedItems, deliveryAddress, usePrimaryAddress, shippingMethod } =
      body;

    let finalDeliveryAddress: OrderDeliveryAddress;

    if (usePrimaryAddress) {
      const primaryAddress = user.deliveryAddresses?.find(
        (addr) => addr.isPrimary,
      );

      if (!primaryAddress) {
        throw new Error('No primary delivery address found for user');
      }

      finalDeliveryAddress = {
        firstName: user.name.split(' ')[0],
        lastName: user.name.split(' ').slice(1).join(' '),
        email: user.email,
        address: primaryAddress.address,
        city: primaryAddress.city,
        state: primaryAddress.state,
        zipcode: primaryAddress.zipcode,
        country: primaryAddress.country,
        postalCode: primaryAddress.postalCode,
        phoneNumber: primaryAddress.phoneNumber,
      };
    } else if (deliveryAddress) {
      finalDeliveryAddress = deliveryAddress;
    } else {
      throw new Error(
        'Either delivery address or usePrimaryAddress flag must be provided',
      );
    }

    // Calculate total price
    let totalPrice = 0;
    for (const item of orderedItems) {
      const product = await this.productService.findOneById(item.productId);
      if (!product) {
        throw new Error(`Product with id ${item.productId} not found`);
      }
      totalPrice += product.price * item.quantity;
    }

    await this.orderService.create({
      orderedItems,
      deliveryAddress: finalDeliveryAddress,
      shippingMethod,
      priceToPay: totalPrice,
      orderHistory: [
        {
          status: OrderStatus.PENDING,
          updatedAt: new Date().toISOString(),
        },
      ],
    });

    return { message: 'Order created successfully' };
  }

  @Get('/')
  @Authorized(Roles.ADMIN)
  @ResponseSchema(OrdersResponse)
  public async getAllOrders(
    @QueryParams() QueryParams: FilterQueryParams<Order[]>,
  ) {
    const { limit, page, sort, filter } = plainToInstance(
      FilterQueryParams,
      QueryParams,
    );

    const { data: orders, meta } = await this.orderService.filter({
      limit,
      page,
      sort,
      filter,
      populate: [
        {
          path: 'orderedByUser',
          Model: 'users',
          type: 'single',
        },
      ],

      Model: OrderType,
    });

    await Promise.all(
      orders.map(async (order) => {
        await Promise.all(
          order.orderedItems?.map(async (item) => {
            const product = await this.productService.findOneById(
              item.productId,
            );
            if (product) {
              if (product.categoryId) {
                const category = await this.categoryService.findOneById(
                  product.categoryId,
                );
                product.categoryId = category;
              }
            }

            item.productId = product;
          }),
        );
      }),
    );

    if (!orders.length) {
      return {
        data: [],
        meta: {
          page,
          limit,
          total: 0,
        },
        message: 'No orders found',
      };
    }

    return {
      data: orders,
      meta,
      message: 'Orders retrieved successfully',
    };
  }

  @Get('/stats')
  @ResponseSchema(OrderStatsResponse)
  @Authorized(Roles.ADMIN)
  public async getOrderStats() {
    try {
      const stats = await this.orderService.aggregate([
        {
          $facet: {
            totalOrders: [
              {
                $count: 'count',
              },
            ],
            newOrders: [
              {
                $match: {
                  createdAt: {
                    $gte: new Date(
                      new Date().setDate(new Date().getDate() - 30),
                    ),
                  },
                },
              },
              { $count: 'count' },
            ],
            completedOrders: [
              { $match: { status: OrderStatus.DELIVERED } },
              { $count: 'count' },
            ],
            cancelledOrders: [
              { $match: { status: OrderStatus.CANCELLED } },
              { $count: 'count' },
            ],
          },
        },
      ]);

      return {
        data: {
          totalOrders: stats[0].totalOrders[0]?.count || 0,
          newOrders: stats[0].newOrders[0]?.count || 0,
          completedOrders: stats[0].completedOrders[0]?.count || 0,
          cancelledOrders: stats[0].cancelledOrders[0]?.count || 0,
        },
        message: 'Order stats retrieved successfully',
      };
    } catch (error) {
      return {
        message: 'Error retrieving order stats',
      };
    }
  }

  @Get('/this-week')
  @Authorized(Roles.ADMIN)
  @ResponseSchema(OrdersResponse)
  public async getThisWeekOrders() {
    const orders = await this.orderService.find({
      filter: {
        createdAt: {
          $gte: new Date(new Date().setDate(new Date().getDate() - 7)),
        },
      },
      sort: { createdAt: -1 },
      populate: [
        {
          path: 'orderedByUser',
          Model: 'users',
          type: 'single',
        },
      ],

      Model: OrderType,
    });

    await Promise.all(
      orders.map(async (order) => {
        await Promise.all(
          order.orderedItems?.map(async (item) => {
            const product = await this.productService.findOneById(
              item.productId,
            );
            if (product) {
              if (product.categoryId) {
                const category = await this.categoryService.findOneById(
                  product.categoryId,
                );
                product.categoryId = category;
              }
            }

            item.productId = plainToInstance(ProductWithCategory, product);
          }),
        );
      }),
    );

    if (!orders) {
      return {
        data: null,
        message: 'No recent orders found',
      };
    }

    return {
      data: orders,
      message: 'Most recent orders retrieved successfully',
    };
  }

  @Get('/my-orders')
  @Authorized(Object.values(Roles))
  @ResponseSchema(MyOrdersResponse)
  public async getMyOrders(
    @CurrentUser() user: User,
    @QueryParams() QueryParams: FilterQueryParams<Order[]>,
  ) {
    const { limit, page, sort, filter } = plainToInstance(
      FilterQueryParams,
      QueryParams,
    );

    console.log(filter);

    const userFilterString = `orderedByUser::eq::${user._id}`;
    const mergedFilter = filter
      ? `${filter};${userFilterString}`
      : userFilterString;

    const { data: orders, meta } = await this.orderService.filter({
      limit,
      page,
      sort,
      filter: mergedFilter,
      Model: MyOrderType,
    });

    await Promise.all(
      orders.map(async (order) => {
        await Promise.all(
          order.orderedItems?.map(async (item) => {
            const product = await this.productService.findOneById(
              item.productId,
            );
            if (product) {
              if (product.categoryId) {
                const category = await this.categoryService.findOneById(
                  product.categoryId,
                );

                product.categoryId = category;
              }
            }
            item.productId = product;
          }),
        );
      }),
    );

    if (!orders.length) {
      return {
        data: [],
        meta: {
          page,
          limit,
          total: 0,
        },
        message: 'No orders found',
      };
    }

    return {
      data: orders,
      meta,
      message: 'Orders retrieved successfully',
    };
  }

  @Get('/:id')
  @Authorized(Object.values(Roles))
  @ResponseSchema(OrderType)
  public async getOrderById(@Param('id') id: Ref<Order>) {
    const order = await this.orderService.findOneById(id, {
      populate: [
        {
          path: 'orderedByUser',
          Model: 'users',
          type: 'single',
        },
        {
          path: 'orderedItems.productId',
          Model: Product,
          type: 'single',
          populate: {
            path: 'categoryId',
            Model: Category,
            type: 'single',
          },
        },
      ],
      Model: OrderType,
    });

    if (!order) {
      return {
        data: null,
        message: `Order with id ${id} not found`,
      };
    }

    return {
      data: order,
      message: `Order with id ${id} retrieved successfully`,
    };
  }

  @Put('/:id')
  @Authorized(Roles.ADMIN)
  @ResponseSchema(UpdateOrderResponse)
  public async updateOrder(
    @Param('id') id: Ref<Order>,
    @Body() body: UpdateOrderBody,
  ) {
    const order = await this.orderService.findOneById(id);
    if (!order) {
      throw new Error(`Order with id ${id} not found`);
    }

    await this.orderService.updateOneById(id, {
      status: body.status,
      shippingMethod: body.shippingMethod,
      orderHistory: [
        ...order.orderHistory,
        {
          status: body.status,
          updatedAt: new Date().toISOString(),
        },
      ],
    });

    const updatedOrder = await this.orderService.findOneById(id, {
      populate: [
        {
          path: 'orderedByUser',
          Model: 'users',
          type: 'single',
        },
        {
          path: 'orderedItems.productId',
          Model: Product,
          type: 'single',
          populate: {
            path: 'categoryId',
            Model: Category,
            type: 'single',
          },
        },
      ],
      Model: OrderType,
    });

    return {
      data: updatedOrder,
      message: `Order updated successfully`,
    };
  }

  @Delete('/:id')
  @Authorized(Roles.ADMIN)
  public async deleteOrder(@Param('id') id: Ref<Order>) {
    const order = await this.orderService.findOneById(id);
    if (!order) {
      throw new Error(`Order with id ${id} not found`);
    }

    await this.orderService.delete(id);

    return {
      message: `Order with id ${id} deleted successfully`,
    };
  }
}
