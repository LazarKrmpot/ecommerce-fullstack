import { getModelForClass, prop } from '@typegoose/typegoose';
import { Document } from 'api/types/document.types';
import { Expose } from 'class-transformer';
import { IsEmail, IsEnum, IsOptional, IsString } from 'class-validator';
import Container from 'typedi';

export enum Roles {
  ADMIN = 'admin',
  USER = 'user',
}

export type RoleType = `${Roles}`;
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
