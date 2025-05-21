import { Redis } from 'ioredis';
import {
  MicroframeworkLoader,
  MicroframeworkSettings,
} from 'microframework-w3tec';

import { env } from 'env';

global.redis as Redis;
export const redisLoader: MicroframeworkLoader = (
  settings: MicroframeworkSettings | undefined,
) => {
  if (!settings || !env.redis.enabled) return;

  const redisURL = env.redis.url || 'redis://localhost:6379';
  const redis = new Redis(redisURL);
  global.redis = redis;
};
