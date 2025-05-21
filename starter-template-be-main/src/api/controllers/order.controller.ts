import { OmitType, PickType } from '@nestjs/swagger';
import { Ref } from '@typegoose/typegoose';
import { Exclude, Type } from 'class-transformer';
import { IsOptional, ValidateNested } from 'class-validator';
import {
  Authorized,
  Body,
  CurrentUser,
  Get,
  JsonController,
  Param,
  Post,
  Put,
} from 'routing-controllers';

import { Order, OrderedItems } from 'api/models/order.model';
import { Product, ProductStatus } from 'api/models/product.model';
import { Shop } from 'api/models/shop.model';
import { Roles, User } from 'api/models/user.model';
import { OrderService } from 'api/services/order.service';
import { ProductService } from 'api/services/product.service';

class PutOrderBody extends PickType(Order, ['status']) {
  @Exclude()
  @IsOptional()
  protected_: null;
}

export class ProductType extends OmitType(Product, ['shopId']) {
  @ValidateNested()
  @Type(() => Shop)
  shopId: Shop;
}

export class OrderedItemsType extends OmitType(OrderedItems, ['productId']) {
  @ValidateNested()
  @Type(() => ProductType)
  productId: ProductType;
}

export class OrderType extends OmitType(Order, [
  'orderedByUser',
  'orderedItems',
  'orderedFromShop',
]) {
  @ValidateNested()
  @Type(() => User)
  orderedByUser: User;

  @ValidateNested({ each: true })
  @Type(() => OrderedItemsType)
  orderedItems: OrderedItemsType[];

  @ValidateNested()
  @Type(() => Shop)
  orderedFromShop: Shop;
}

export class CreateOrder extends PickType(Order, [
  'orderedFromShop',
  'orderedItems',
]) {
  @Exclude()
  @IsOptional()
  protected_: null;
}
@JsonController('/orders')
export class OrderController {
  constructor(
    private orderService: OrderService,
    private productService: ProductService,
  ) {}

  @Get('/')
  @Authorized(Roles.ADMIN)
  public async getAllOrders() {
    const orders = await this.orderService.find({
      populate: [
        'orderedByUser',
        'orderedItems.productId',
        { path: 'orderedItems.productId', populate: { path: 'shopId' } },
        'orderedFromShop',
      ],
      Model: OrderType,
    });
    if (orders.length === 0) {
      return { message: 'No orders found' };
    }
    return { data: orders };
  }

  @Get('/my-orders')
  @Authorized(Object.values(Roles))
  public async getMyOrders(@CurrentUser() user: User) {
    const order = await this.orderService.find({
      filter: { orderedByUser: user._id },
      populate: [
        'orderedByUser',
        'orderedItems.productId',
        { path: 'orderedItems.productId', populate: { path: 'shopId' } },
        'orderedFromShop',
      ],
      Model: OrderType,
    });

    if (order.length === 0) {
      return { message: 'No orders found' };
    }

    return { data: order };
  }

  @Get('/by-shop/:id')
  @Authorized(Roles.ADMIN)
  public async getOrdersByShop(@Param('id') id: Ref<Shop>) {
    const orders = await this.orderService.find({
      filter: { orderedFromShop: id },
      populate: [
        'orderedByUser',
        'orderedItems.productId',
        { path: 'orderedItems.productId', populate: { path: 'shopId' } },
        'orderedFromShop',
      ],
      Model: OrderType,
    });
    if (orders.length === 0) {
      return { message: 'No orders found for this shop' };
    }
    return { data: orders };
  }

  @Post('/')
  // @Authorized(Object.values(Roles))
  public async createOrder(
    @CurrentUser() user: User,
    @Body() body: CreateOrder,
  ) {
    const { orderedItems, orderedFromShop } = body;

    const products = await Promise.all(
      orderedItems.map((item) =>
        this.productService.findOneById(item.productId),
      ),
    );

    const OutOfStockItems: Product[] = [];

    const outOfStock = orderedItems.some((orderedItem) => {
      const product = products.find((p) => p._id === orderedItem.productId);

      if (product.stock < orderedItem.quantity) {
        OutOfStockItems.push(product);
        return true;
      }
      return false;
    });

    if (outOfStock) {
      const outOfStockNames = OutOfStockItems.map((item) => item.name).join(
        ', ',
      );
      return {
        message: `The following items are out of stock: ${outOfStockNames}. Please check your order and try again.`,
      };
    }
    products.forEach((product) => {
      const orderedItem = orderedItems.find(
        (item) => item.productId === product._id,
      );
      const newStock = product.stock - orderedItem.quantity;

      this.productService.updateOneById(product._id, {
        stock: newStock,
        ...(newStock === 0 && { status: ProductStatus.OUTOFSTOCK }),
      });
    });
    products.forEach((product) => {
      const orderedItem = orderedItems.find(
        (item) => item.productId === product._id,
      );
      this.productService.updateOneById(product._id, {
        stock: product.stock - orderedItem.quantity,
      });
    });

    const priceToPay = products.reduce(
      (total, product, index) =>
        total + product.price * orderedItems[index].quantity,
      0,
    );

    const orderItems = products.map((product) => {
      return {
        productId: product._id,
        quantity: orderedItems.find((item) => item.productId === product._id)
          .quantity,
      };
    });

    await this.orderService.create({
      orderedByUser: user._id,
      orderedFromShop,
      orderedItems: orderItems,
      priceToPay,
    });

    return { message: 'Order created successfully' };
  }

  @Put('/:id')
  @Authorized(Roles.ADMIN)
  public async updateOrder(
    @Param('id') id: Ref<Order>,
    @Body() body: PutOrderBody,
  ) {
    const { status } = body;
    const existing = await this.orderService.findOneById(id);
    if (!existing) {
      return { message: 'Order not found' };
    }
    await this.orderService.updateOneById(id, { status });

    return { message: 'Order updated successfully' };
  }
}
