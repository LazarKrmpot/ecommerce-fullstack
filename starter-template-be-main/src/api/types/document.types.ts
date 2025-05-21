import { Ref } from '@typegoose/typegoose';
import { Exclude, Expose, Transform } from 'class-transformer';
import { IsDateString, IsInt, IsMongoId } from 'class-validator';

import { transformMongoId } from 'utils/class-transformers/transformMongoId';

export class Document {
  @Expose()
  @IsMongoId()
  @Transform(transformMongoId)
  public _id: Ref<any>;

  @Exclude()
  @IsInt()
  public __v: number;
}

export class DocumentWithTimestamps extends Document {
  @Expose()
  @IsDateString()
  public createdAt: Date;

  @Expose()
  @IsDateString()
  public updatedAt: Date;
}
