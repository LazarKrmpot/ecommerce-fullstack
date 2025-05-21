import { Ref, prop } from '@typegoose/typegoose';
import { Roles } from 'api/models/user.model';
import { Exclude, Expose, Transform } from 'class-transformer';
import {
  IsEmail,
  IsEnum,
  IsInt,
  IsMongoId,
  IsOptional,
  IsString,
} from 'class-validator';
import { transformMongoId } from 'utils/class-transformers/transformMongoId';

export class UserType {
  @Expose()
  @IsMongoId()
  @Transform(transformMongoId)
  public _id: Ref<any>;

  @Expose()
  @IsString()
  public name: string;

  @Expose()
  @IsEmail()
  @prop({ type: String, required: true, unique: true })
  public email: string;

  @Expose()
  @IsEnum(Roles)
  @IsOptional()
  public role: Roles;

  @Exclude()
  @IsInt()
  public __v: number;
}
