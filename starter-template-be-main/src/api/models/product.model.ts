import { Ref, getModelForClass, prop } from '@typegoose/typegoose';
import { Document } from 'api/types/document.types';
import { Expose, Transform } from 'class-transformer';
import {
  IsBoolean,
  IsEnum,
  IsMongoId,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import { SchemaTypes } from 'mongoose';
import Container from 'typedi';
import { transformMongoId } from 'utils/class-transformers/transformMongoId';

import { Category } from './category.model';
import { Shop } from './shop.model';

export enum ProductStatus {
  INSTOCK = 'in stock',
  OUTOFSTOCK = 'out of stock',
}

export enum Currency {
  RSD = 'RSD',
  EUR = 'EUR',
  USD = 'USD',
  GBP = 'GBP',
  JPY = 'JPY',
  RUB = 'RUB',
}

export class Product extends Document {
  @Expose()
  @IsString()
  @prop({ type: String, required: true })
  public name: string;

  @Expose()
  @IsString()
  @IsOptional()
  @prop({ type: String })
  public description?: string;

  @Expose()
  @IsMongoId()
  @Transform(transformMongoId)
  @prop({ type: SchemaTypes.ObjectId, ref: 'Category' })
  public categoryId: Ref<Category>;

  @Expose()
  @IsNumber()
  @prop({ type: Number, required: true })
  public price: number;

  @Expose()
  @IsEnum(ProductStatus)
  @IsOptional()
  @prop({ type: String, required: true, default: ProductStatus.INSTOCK })
  public status: ProductStatus;

  @Expose()
  @IsBoolean()
  @IsOptional()
  @prop({ type: Boolean, default: false })
  public isFeatured: boolean;

  // @Expose()
  // @IsArray()
  // @IsOptional()
  // @prop({ type: Array, default: [] })
  // public images: string[];

  @Expose()
  @IsNumber()
  @IsOptional()
  @prop({ type: Number, default: 0 })
  public rating: number;

  @Expose()
  @IsOptional()
  @IsEnum(Currency)
  @prop({ type: String, required: true, default: Currency.RSD })
  public currency: Currency;

  @Expose()
  @IsNumber()
  @IsOptional()
  @prop({ type: Number })
  public stock: number;

  @Expose()
  @IsMongoId()
  @IsOptional()
  @Transform(transformMongoId)
  @prop({ type: SchemaTypes.ObjectId, ref: 'Shop' })
  public shopId?: Ref<Shop>;
}

export const ProductModel = getModelForClass(Product, {
  schemaOptions: { timestamps: true },
});

Container.set(Product.name, ProductModel);
