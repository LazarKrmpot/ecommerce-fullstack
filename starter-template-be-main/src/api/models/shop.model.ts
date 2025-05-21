import { getModelForClass, prop } from '@typegoose/typegoose';
import { Expose } from 'class-transformer';
import { IsString } from 'class-validator';
import Container from 'typedi';

import { Document } from 'api/types/document.types';

export class Shop extends Document {
  @Expose()
  @IsString()
  @prop({ type: String, required: true })
  public name: string;

  @Expose()
  @IsString()
  @prop({ type: String, required: true })
  public description: string;

  @Expose()
  @IsString()
  @prop({ type: String, required: true })
  public address: string;
}

export const ShopModel = getModelForClass(Shop, {
  schemaOptions: { timestamps: true },
});

Container.set(Shop.name, ShopModel);
