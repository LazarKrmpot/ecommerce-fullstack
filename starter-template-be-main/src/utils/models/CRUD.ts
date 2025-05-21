import { Ref } from '@typegoose/typegoose';
import { ClassConstructor, plainToInstance } from 'class-transformer';
import {
  AggregateOptions,
  FilterQuery,
  Model,
  PipelineStage,
  QueryOptions,
  Types,
  UpdateQuery,
} from 'mongoose';

import { FilterQueryParams } from 'api/types/filter.types';
import { modelFilter } from 'utils/filter';

export abstract class CRUD<T> {
  Class: ClassConstructor<T>;
  model: Model<T>;

  constructor(Class: ClassConstructor<T>, model: Model<T>) {
    this.Class = Class;
    this.model = model;
  }

  public async aggregate(
    pipeline: PipelineStage[],
    options?: AggregateOptions,
  ) {
    return this.model.aggregate(pipeline, {
      allowDiskUse: true,
      ...options,
    });
  }

  public async filter(filter: FilterQueryParams<T>) {
    return modelFilter({
      modelClass: this.Class,
      model: this.model,
      query: filter,
    });
  }

  public async find<V = T>({
    filter = {},
    sort,
    populate,
    limit,
    //@ts-expect-error
    Model = this.Class,
    select,
  }: {
    filter?: FilterQuery<T>;
    sort?: any;
    populate?: any;
    limit?: number;
    Model?: ClassConstructor<V>;
    select?: string[];
  }): Promise<V[]> {
    const query = this.model.find(filter).lean();
    if (populate) query.populate(populate);
    if (select) query.select(select);
    if (sort) query.sort(sort);
    if (limit) query.limit(limit);

    const entities = await query;
    return plainToInstance(Model, entities);
  }

  public async exists({
    filter = {},
  }: {
    filter?: FilterQuery<T>;
  }): Promise<any & { _id: Types.ObjectId }> {
    const query = this.model.exists(filter).lean();

    const exists = await query;
    return exists;
  }

  public async findOne<V = T>({
    filter,
    populate,
    select,
    sort,
    //@ts-expect-error
    Model = this.Class,
  }: {
    filter: FilterQuery<T>;
    populate?: any;
    select?: string[];
    sort?: any;
    Model?: ClassConstructor<V>;
  }) {
    const query = this.model.findOne(filter).lean();
    if (populate) query.populate(populate);
    if (select) query.select(select);
    if (sort) query.sort(sort);

    const entity = await query;
    return plainToInstance(Model, entity);
  }

  public async findOneById<V = T>(
    id: Ref<T>,
    options?: {
      populate?: any;
      Model?: ClassConstructor<V>;
      select?: string[];
    },
  ) {
    const query = this.model.findById(id).lean();
    if (options?.populate) query.populate(options.populate);
    if (options?.select) query.select(options.select);

    const Model = options?.Model || this.Class;

    const entity = await query;
    // @ts-expect-error
    return plainToInstance(Model, entity) as V;
  }

  public async distinct(
    {
      filter,
      sort,
    }: {
      filter: FilterQuery<T>;
      sort?: any;
    },
    field: keyof T,
  ) {
    const query = this.model.find(filter).lean();
    if (sort) query.sort(sort);

    const entities = await query.distinct(field as string);

    return entities.map((entity) => entity.toString());
  }

  public async count(filter: FilterQuery<T>) {
    return this.model.countDocuments(filter).lean();
  }

  public async create(c: Partial<T>): Promise<Ref<T>> {
    const { _id } = await this.model.create(c);
    return _id as Ref<T>;
  }

  public async updateOne(
    filter: FilterQuery<T>,
    u: UpdateQuery<T>,
    options?: QueryOptions<T>,
  ) {
    await this.model.findOneAndUpdate(filter, u, options);
  }

  public async updateOneById(id: Ref<T>, u: UpdateQuery<T> | Partial<T>) {
    await this.model.findByIdAndUpdate(id, u);
  }

  public async updateMany(
    filter: FilterQuery<T>,
    u: UpdateQuery<T> | Partial<T>,
  ) {
    await this.model.updateMany(filter, u);
  }

  public async delete(id: Ref<T>) {
    await this.model.findByIdAndDelete(id);
  }

  public async deleteMany(filter: FilterQuery<T>) {
    await this.model.deleteMany(filter);
  }
}
