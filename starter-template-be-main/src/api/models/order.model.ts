import { Ref, getModelForClass, prop } from '@typegoose/typegoose';
import { Document } from 'api/types/document.types';
import { Expose, Transform, Type } from 'class-transformer';
import {
  IsArray,
  IsEnum,
  IsMongoId,
  IsNumber,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { SchemaTypes } from 'mongoose';
import Container from 'typedi';
import { transformMongoId } from 'utils/class-transformers/transformMongoId';

import { Product } from './product.model';
import { User } from './user.model';

export enum OrderStatus {
  PENDING = 'pending',
  ACCEPTED = 'accepted',
  REJECTED = 'rejected',
  DELIVERED = 'delivered',
  CANCELLED = 'cancelled',
}

export enum ShippingMethod {
  STANDARD = 'standard',
  EXPRESS = 'express',
  OVERNIGHT = 'overnight',
}

export class OrderedItem {
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

export class OrderHistory {
  @Expose()
  @IsEnum(OrderStatus)
  @prop({ type: String, enum: OrderStatus, required: true })
  public status: OrderStatus;

  @Expose()
  @IsString()
  @prop({ type: String, required: true })
  public updatedAt: string;
}

export class OrderDeliveryAddress {
  @Expose()
  @IsString()
  @prop({ type: String, required: true })
  public firstName: string;

  @Expose()
  @IsString()
  @prop({ type: String, required: true })
  public lastName: string;

  @Expose()
  @IsString()
  @prop({ type: String, required: true })
  public email: string;

  @Expose()
  @IsString()
  @prop({ type: String, required: true })
  public address: string;

  @Expose()
  @IsString()
  @prop({ type: String, required: true })
  public city: string;

  @Expose()
  @IsString()
  @prop({ type: String, required: true })
  public state: string;

  @Expose()
  @IsNumber()
  @prop({ type: Number, required: true })
  public zipcode: number;

  @Expose()
  @IsString()
  @prop({ type: String, required: true })
  public country: string;

  @Expose()
  @IsNumber()
  @prop({ type: Number, required: true })
  public postalCode: number;

  @Expose()
  @IsString()
  @prop({ type: String, required: true })
  public phoneNumber: string;
}

export class Order extends Document {
  @Expose()
  @IsMongoId()
  @IsOptional()
  @Transform(transformMongoId)
  @prop({ type: SchemaTypes.ObjectId, ref: 'User' })
  public orderedByUser?: Ref<User>;

  @Expose()
  @ValidateNested()
  @IsOptional()
  @Type(() => OrderDeliveryAddress)
  @prop({
    type: () => OrderDeliveryAddress,
    required: false,
    _id: false,
    default: null,
  })
  public deliveryAddress?: OrderDeliveryAddress;

  @Expose()
  @ValidateNested({ each: true })
  @Type(() => OrderedItem)
  @prop({ type: () => [OrderedItem], required: true, _id: false })
  public orderedItems: OrderedItem[];

  @Expose()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => OrderHistory)
  @prop({ type: () => [OrderHistory], default: [], _id: false })
  public orderHistory: OrderHistory[];

  @Expose()
  @IsEnum(OrderStatus)
  @prop({
    type: String,
    enum: OrderStatus,
    default: OrderStatus.PENDING,
  })
  public status: OrderStatus;

  @Expose()
  @IsEnum(ShippingMethod)
  @prop({ type: String, required: true })
  public shippingMethod: ShippingMethod;

  @Expose()
  @IsNumber()
  @prop({ type: Number, required: true })
  public priceToPay: number;
}

export const OrderModel = getModelForClass(Order, {
  schemaOptions: { timestamps: true },
});

Container.set(Order.name, OrderModel);
