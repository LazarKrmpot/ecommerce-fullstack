import { Dictionary, isNil, omitBy } from 'lodash';

export function omitNil<T>(object: Dictionary<T>) {
  return omitBy(object, isNil);
}
