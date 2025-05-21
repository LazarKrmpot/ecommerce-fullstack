import { TransformFnParams } from 'class-transformer';
import { Types, isValidObjectId } from 'mongoose';

export const transformMongoId = (value: TransformFnParams) => {
  if ('value' in value) {
    const _id = value.obj[value.key];
    if (_id && isValidObjectId(_id)) {
      return value.obj[value.key].toString();
    }

    return value.obj[value.key];
  }

  return undefined;
};

export const transformMongoIdArray = (value: TransformFnParams) => {
  if ('value' in value && Array.isArray(value.obj[value.key])) {
    return value.obj[value.key].map((key: Types.ObjectId) => {
      if (key && isValidObjectId(key)) {
        return key.toString();
      }
      return key;
    });
  }

  return [];
};
