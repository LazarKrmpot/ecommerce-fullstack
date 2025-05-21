import { ClassConstructor, Expose, Transform, Type } from 'class-transformer';
import { IsInt, IsOptional, IsString, ValidateNested } from 'class-validator';
import { FilterQuery } from 'mongoose';

import { transformDefaultValue } from 'utils/class-transformers/transformDefaultValue';

export class FilterQueryParams<T> {
  @Expose()
  @IsOptional()
  @IsInt()
  @Transform(transformDefaultValue(20))
  limit: number;

  @Expose()
  @IsOptional()
  @IsInt()
  @Transform(transformDefaultValue(1))
  page: number;

  @Expose()
  @IsOptional()
  @IsString()
  sort?: string;

  @Expose()
  @IsOptional()
  @IsString()
  filter?: string;

  @Expose()
  populate?: string | string[] | any;

  @Expose()
  defaultFilter?: FilterQuery<T>;

  @Expose()
  preFilter?: FilterQuery<T>;

  @Expose()
  aggregations?: any;

  @Expose()
  Model?: ClassConstructor<unknown>;
}

class FilterMetaPagination {
  @IsInt()
  currentPage: number;

  @IsInt()
  pageSize: number;

  @IsInt()
  totalPages: number;

  @IsInt()
  totalResults: number;
}

export class FilterMeta {
  @ValidateNested()
  @Type(() => FilterMetaPagination)
  pagination: FilterMetaPagination;
}
