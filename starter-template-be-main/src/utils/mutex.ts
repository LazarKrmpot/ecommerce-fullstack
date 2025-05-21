import { Mutex, MutexInterface } from 'async-mutex';

type MutexFunction<T extends any[], R> = (...args: T) => R | Promise<R>;

interface MutexOptions {
  keyGenerator: (...args: any[]) => string;
}

export function mutexWrapper<T extends any[], R>(
  fn: MutexFunction<T, R>,
  options: MutexOptions,
) {
  return async (...args: T): Promise<R> => {
    const key = options.keyGenerator(...args);

    if (!global.mutex[key]) {
      global.mutex[key] = new Mutex();
    }

    // ?|> Acquire the lock
    const release = (await global.mutex[
      key
    ].acquire()) as MutexInterface.Releaser;

    const result = await Promise.resolve(fn(...args));

    // ?|> Release the lock
    release();

    return result;
  };
}
