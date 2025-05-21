import { readFileSync } from 'fs';
import * as path from 'path';

import * as dotenv from 'dotenv';

import {
  getOsEnv,
  getOsEnvOptional,
  getOsPaths,
  normalizePort,
  toBool,
} from './utils/env';

/**
 * Load .env file or for test the .env.test file.
 */
dotenv.config({
  path: path.join(
    process.cwd(),
    `.env${process.env.NODE_ENV ? `.${process.env.NODE_ENV}` : ''}`,
  ),
});

const pkg = JSON.parse(readFileSync('./package.json', 'utf-8'));

/**
 * Environment variables
 */
export const env = {
  node: process.env.NODE_ENV || 'development',
  isProduction: process.env.NODE_ENV === 'production',
  isTest: process.env.NODE_ENV === 'test',
  isDevelopment: process.env.NODE_ENV === 'development',
  app: {
    name: getOsEnv('APP_NAME'),
    version: (pkg as any).version,
    description: (pkg as any).description,
    host: getOsEnv('APP_HOST'),
    schema: getOsEnv('APP_SCHEMA'),
    routePrefix: getOsEnv('APP_ROUTE_PREFIX'),
    port: normalizePort(process.env.PORT || getOsEnv('APP_PORT')) as number,
    banner: toBool(getOsEnv('APP_BANNER')),
    decodeKey: getOsEnv('APP_DECODE_KEY'),
    dirs: {
      controllers: getOsPaths('CONTROLLERS'),
      middlewares: getOsPaths('MIDDLEWARES'),
      interceptors: getOsPaths('INTERCEPTORS'),
      crons: getOsPaths('CRONS'),
      subscribers: getOsPaths('SUBSCRIBERS'),
      resolvers: getOsPaths('RESOLVERS'),
      sockets: getOsPaths('SOCKETS'),
      socketsMiddlewares: getOsPaths('SOCKETS_MIDDLEWARES'),
    },
  },
  log: {
    level: getOsEnv('LOG_LEVEL'),
    json: toBool(getOsEnvOptional('LOG_JSON')),
    output: getOsEnv('LOG_OUTPUT'),
  },
  db: {
    uri: getOsEnv('MONGODB_URI'),
    logging: toBool(getOsEnv('MONGODB_LOGGING')),
  },
  redis: {
    enabled: toBool(getOsEnv('REDIS_ENABLED')),
    url: getOsEnv('REDIS_URL'),
  },
  swagger: {
    enabled: toBool(getOsEnv('SWAGGER_ENABLED')),
    route: getOsEnv('SWAGGER_ROUTE'),
  },
};
