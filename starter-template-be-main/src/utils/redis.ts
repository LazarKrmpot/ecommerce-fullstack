type CacheableFunction<T extends any[], R> = (...args: T) => R | Promise<R>;

interface CacheOptions {
  ttl?: number;
  keyGenerator: (...args: any[]) => string;
  type?: 'string' | 'json';
}

export function redisCache<T extends any[], R>(
  fn: CacheableFunction<T, R>,
  options: CacheOptions,
  type = 'json',
) {
  const REDIS_TTL = options.ttl || 3600;

  return async (...args: T): Promise<R> => {
    const REDIS_KEY = options.keyGenerator(...args);

    const cachedResult = await global.redis.get(REDIS_KEY);
    if (cachedResult) {
      return JSON.parse(cachedResult);
    }

    const result = await Promise.resolve(fn(...args));
    if (!result) {
      return result;
    }

    let REDIS_RESULT: string = result as any;
    switch (type) {
      case 'json':
        REDIS_RESULT = JSON.stringify(result);
        break;
    }

    await global.redis.setex(REDIS_KEY, REDIS_TTL, REDIS_RESULT);
    return result;
  };
}
