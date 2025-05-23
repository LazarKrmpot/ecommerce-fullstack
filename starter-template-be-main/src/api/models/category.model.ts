import { getModelForClass, prop } from '@typegoose/typegoose';
import { Document } from 'api/types/document.types';
import { Expose } from 'class-transformer';
import { IsOptional, IsString } from 'class-validator';
import Container from 'typedi';
export class Category extends Document {
  @Expose()
  @IsString()
  @prop({ type: String, required: true })
  public name: string;

  @Expose()
  @IsString()
  @IsOptional()
  @prop({ type: String, default: '' })
  public description?: string;
}

export const CategoryModel = getModelForClass(Category, {
  schemaOptions: {
    timestamps: true,
  },
});

Container.set(Category.name, CategoryModel);
