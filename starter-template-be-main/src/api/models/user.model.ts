import { getModelForClass, prop } from '@typegoose/typegoose';
import { Document } from 'api/types/document.types';
import { Expose, Type } from 'class-transformer';
import {
  IsBoolean,
  IsEmail,
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import Container from 'typedi';

export enum Roles {
  ADMIN = 'admin',
  USER = 'user',
}

export type RoleType = `${Roles}`;

export class DeliveryAddressInfo extends Document {
  @Expose()
  @IsBoolean()
  @prop({ type: Boolean, required: true })
  public isPrimary: boolean;

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
export class User extends Document {
  @Expose()
  @IsString()
  @prop({ type: String, required: true })
  public name: string;

  @Expose()
  @IsEmail()
  @prop({ type: String, required: true, unique: true })
  public email: string;

  @Expose()
  @IsString()
  @IsOptional()
  @prop({ type: String, select: false })
  public password: string;

  @Expose()
  @ValidateNested({ each: true })
  @Type(() => DeliveryAddressInfo)
  @prop({ type: () => [DeliveryAddressInfo], default: [], _id: true })
  public deliveryAddresses: DeliveryAddressInfo[];

  @Expose()
  @IsEnum(Roles)
  @IsOptional()
  @prop({
    type: String,
    enum: Roles,
    default: Roles.USER,
  })
  public role: Roles;
}

export const UserModel = getModelForClass(User, {
  schemaOptions: { timestamps: true },
});

Container.set(User.name, UserModel);
