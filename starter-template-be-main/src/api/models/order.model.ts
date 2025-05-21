import { Ref, getModelForClass, prop } from '@typegoose/typegoose';
import { Expose, Transform, Type } from 'class-transformer';
import { IsEnum, IsMongoId, IsNumber, ValidateNested } from 'class-validator';
import { SchemaTypes } from 'mongoose';
import Container from 'typedi';

import { Document } from 'api/types/document.types';
import { transformMongoId } from 'utils/class-transformers/transformMongoId';

import { Product } from './product.model';
import { Shop } from './shop.model';
import { User } from './user.model';

export enum OrderStatus {
  PENDING = 'pending',
  ACCEPTED = 'accepted',
  REJECTED = 'rejected',
  DELIVERED = 'delivered',
  CANCELLED = 'cancelled',
}

export class OrderedItems {
  @Expose()
  @IsMongoId()
  @Transform(transformMongoId)
  @prop({ type: SchemaTypes.ObjectId, ref: 'Product' })
  public productId: Ref<Product>;

  @Expose()
  @IsNumber()
  @prop({ type: Number, required: true })
  public quantity: number;
}

export class Order extends Document {
  @Expose()
  @IsMongoId()
  @Transform(transformMongoId)
  @prop({ type: SchemaTypes.ObjectId, ref: 'User' })
  public orderedByUser: Ref<User>;

  @Expose()
  @IsMongoId()
  @Transform(transformMongoId)
  @prop({ type: SchemaTypes.ObjectId, ref: 'Shop' })
  public orderedFromShop: Ref<Shop>;

  @Expose()
  @ValidateNested({ each: true })
  @Type(() => OrderedItems)
  @prop({ type: () => [OrderedItems], required: true, _id: false })
  public orderedItems: OrderedItems[];

  @Expose()
  @IsEnum(OrderStatus)
  @prop({
    type: String,
    enum: OrderStatus,
    default: OrderStatus.PENDING,
  })
  public status: OrderStatus;

  @Expose()
  @IsNumber()
  @prop({ type: Number })
  public priceToPay: number;
}

export const OrderModel = getModelForClass(Order, {
  schemaOptions: { timestamps: true },
});

Container.set(Order.name, OrderModel);
