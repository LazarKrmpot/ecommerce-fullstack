import { TransformFnParams } from 'class-transformer';

export const transformDefaultValue = (defaultValue: any) => {
  return (value: TransformFnParams) => {
    if ('value' in value) {
      if (!value.obj[value.key]) {
        return defaultValue;
      }

      return value.obj[value.key];
    }
  };
};
