import { plainToInstance } from 'class-transformer';
import { isEqual } from 'lodash';
import { FilterQuery, Model, isValidObjectId } from 'mongoose';

import { FilterMeta, FilterQueryParams } from 'api/types/filter.types';

import { mongoId } from './mongoId';

type Filter<T, V> = {
  modelClass: T;
  model: Model<V>;
  query: FilterQueryParams<T>;
};

export async function modelFilter<T, V>({
  modelClass,
  model,
  query,
}: Filter<T, V>): Promise<{
  data: V[];
  meta: FilterMeta;
}> {
  const {
    limit,
    page,
    sort: sortString,
    filter: filterString,
    aggregations,
    populate,
    defaultFilter,
    preFilter,
    Model,
  } = query;

  const match: FilterQuery<any> = {
    ...(defaultFilter ?? {}),
  };

  if (filterString) {
    const filters = filterString.split(';');

    const parsedValue = (value: string) => {
      if (isValidObjectId(value)) {
        return mongoId(value);
      }

      switch (value) {
        case 'true':
          return true;
        case 'false':
          return false;
        case 'null':
          return null;
        case 'undefined':
          return undefined;
        default:
          return value;
      }
    };

    const addFilter = (key: string, expression: any) => {
      if (!match[key]) {
        match[key] = expression;
      } else {
        match[key] = { ...match[key], ...expression };
      }
    };

    filters.forEach((filter) => {
      const [key, operator, value] = filter.split('::');

      switch (operator) {
        case 'regex':
          addFilter(key, { $regex: value, $options: 'i' });
          break;
        case 'eq':
          addFilter(key, { $eq: parsedValue(value) });
          break;
        case 'neq':
          addFilter(key, { $ne: value });
          break;
        case 'exists':
          addFilter(key, { $exists: JSON.parse(value) });
          break;
        case 'gt':
          addFilter(key, { $gt: parseFloat(value) });
          break;
        case 'gte':
          addFilter(key, { $gte: parseFloat(value) });
          break;
        case 'lt':
          addFilter(key, { $lt: parseFloat(value) });
          break;
        case 'lte':
          addFilter(key, { $lte: parseFloat(value) });
          break;
        case 'in':
          addFilter(key, { $in: value.split(',') });
          break;
        case 'nin':
          addFilter(key, { $nin: value.split(',') });
          break;
        default:
          break;
      }
    });
  }

  const sort = {};
  sortString?.split(',').forEach((singleSortString) => {
    const order = singleSortString.startsWith('-') ? -1 : 1;

    sort[singleSortString.replace(/^-/, '')] = order;
  });

  // Create Filter Aggregation
  const filterDataAggregation = [{ $match: preFilter ?? {} }];
  if (isEqual(match, {})) {
    filterDataAggregation.push(
      // @ts-expect-error
      ...(!isEqual(sort, {}) ? [{ $sort: sort }] : []),
      ...(limit === -1
        ? []
        : [{ $skip: (page - 1) * limit }, { $limit: limit }]),
    );
  }
  filterDataAggregation.push(...(aggregations || []));
  if (populate) {
    filterDataAggregation.push(
      ...populate.flatMap((p) => {
        return [
          {
            $lookup: {
              from: p.Model,
              localField: p.path,
              foreignField: p.field || '_id',
              as: p.as || p.path,
            },
          },
          ...(p.type === 'single'
            ? [
                {
                  $addFields: {
                    [p.as || p.path]: {
                      $cond: {
                        if: { $isArray: `$${p.as || p.path}` },
                        then: { $arrayElemAt: [`$${p.as || p.path}`, 0] },
                        else: `$${p.as || p.path}`,
                      },
                    },
                  },
                },
              ]
            : []),
          ...(p.type === 'count'
            ? [
                {
                  $addFields: {
                    [p.as || p.path + '_count']: {
                      $size: '$' + (p.as || p.path),
                    },
                  },
                },
              ]
            : []),
        ];
      }),
    );
  }
  if (!isEqual(match, {})) {
    filterDataAggregation.push(
      { $match: match },
      // @ts-expect-error
      ...(!isEqual(sort, {}) ? [{ $sort: sort }] : []),
      ...(limit === -1
        ? []
        : [{ $skip: (page - 1) * limit }, { $limit: limit }]),
    );
  }

  const filterMetaAggregation = [{ $match: preFilter ?? {} }];
  if (!isEqual(match, {})) {
    filterMetaAggregation.push(...(aggregations || []));
    if (populate) {
      filterMetaAggregation.push(
        ...populate.flatMap((p) => {
          return [
            {
              $lookup: {
                from: p.Model,
                localField: p.path,
                foreignField: p.field || '_id',
                as: p.as || p.path,
              },
            },
            ...(p.type === 'single'
              ? [
                  {
                    $addFields: {
                      [p.as || p.path]: {
                        $cond: {
                          if: { $isArray: `$${p.as || p.path}` },
                          then: { $arrayElemAt: [`$${p.as || p.path}`, 0] },
                          else: `$${p.as || p.path}`,
                        },
                      },
                    },
                  },
                ]
              : []),
            ...(p.type === 'count'
              ? [
                  {
                    $addFields: {
                      [p.as || p.path + '_count']: {
                        $size: '$' + (p.as || p.path),
                      },
                    },
                  },
                ]
              : []),
          ];
        }),
      );
    }
    filterMetaAggregation.push({ $match: match });
  }
  // @ts-expect-error
  filterMetaAggregation.push({ $count: 'totalResults' });

  // Create search model
  const [aggregationData, aggregationMeta] = await Promise.all([
    model.aggregate(filterDataAggregation),
    model.aggregate(filterMetaAggregation),
  ]);

  const totalResults = aggregationMeta[0]?.totalResults ?? 0;
  const meta: FilterMeta = {
    pagination: {
      currentPage: page,
      pageSize: limit,
      totalPages: Math.ceil(totalResults / limit),
      totalResults,
    },
  };

  //@ts-expect-error
  modelClass = Model ?? modelClass;
  //@ts-expect-error
  return { data: plainToInstance(modelClass, aggregationData), meta };
}
