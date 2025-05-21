import { defaultMetadataStorage } from 'class-transformer/cjs/storage';
import { validationMetadatasToSchemas } from 'class-validator-jsonschema';
import { cloneDeep, forEach, map, some } from 'lodash';
import {
  MicroframeworkLoader,
  MicroframeworkSettings,
} from 'microframework-w3tec';
import redoc from 'redoc-express';
import { getMetadataArgsStorage } from 'routing-controllers';
import { routingControllersToSpec } from 'routing-controllers-openapi';

import { env } from 'env';
import { findDeep } from 'utils/findDeep';

export const SUB_SWAGGER_KEYS = [''];
export const swaggerLoader: MicroframeworkLoader = (
  settings: MicroframeworkSettings | undefined,
) => {
  if (!settings || !env.swagger.enabled) return;

  const expressApp = settings.getData('express_app');

  const schemas = validationMetadatasToSchemas({
    refPointerPrefix: '#/components/schemas/',
    classTransformerMetadataStorage: defaultMetadataStorage,
  });

  const swaggerFile = routingControllersToSpec(
    getMetadataArgsStorage(),
    {},
    {
      components: {
        //@ts-expect-error
        schemas,
        securitySchemes: {
          bearerAuth: {
            type: 'http',
            scheme: 'bearer',
            bearerFormat: 'JWT',
          },
        },
      },
    },
  );

  // Add npm infos to the swagger doc
  swaggerFile.info = {
    title: env.app.name,
    description: env.app.description,
    version: env.app.version,
  };
  swaggerFile.servers = [
    {
      url:
        process.env.NODE_ENV === 'production'
          ? `${env.app.schema}://${env.app.host}${env.app.routePrefix}`
          : `${env.app.schema}://${env.app.host}:${env.app.port}${env.app.routePrefix}`,
    },
  ];

  forEach(SUB_SWAGGER_KEYS, (swaggerKey) => {
    const subSwaggerFile = cloneDeep(swaggerFile);
    subSwaggerFile.paths = {};
    subSwaggerFile.components.schemas = {};

    Object.keys(swaggerFile.paths).forEach((key) => {
      if (key.startsWith(`${swaggerKey}/`)) {
        subSwaggerFile.paths[key] = swaggerFile.paths[key];
      }
    });

    let refs = map(findDeep(subSwaggerFile.paths, '$ref'), (key) =>
      key.replace('#/components/schemas/', ''),
    );
    while (refs.length) {
      const addToSchemas = {};
      Object.keys(swaggerFile.components.schemas).forEach((key) => {
        const isInRefs = some(
          refs,
          (ref) =>
            key === ref &&
            !Object.keys(subSwaggerFile.components.schemas).includes(key),
        );
        if (isInRefs) {
          addToSchemas[key] = swaggerFile.components.schemas[key];
          subSwaggerFile.components.schemas[key] =
            swaggerFile.components.schemas[key];
        }
      });

      refs = map(findDeep(addToSchemas, '$ref'), (key) =>
        key.replace('#/components/schemas/', ''),
      );
    }

    expressApp.use(`${swaggerKey}${env.swagger.route}.json`, (_req, res) =>
      res.json(subSwaggerFile),
    );
    expressApp.use(
      `${swaggerKey}${env.swagger.route}`,
      redoc({
        title: env.app.name,
        specUrl: `${swaggerKey}${env.swagger.route}.json`,
      }),
    );
  });
};
