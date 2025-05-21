import {
  MicroframeworkLoader,
  MicroframeworkSettings,
} from 'microframework-w3tec';
import { useExpressServer } from 'routing-controllers';

import { authorizationChecker } from 'auth/authorization-checker.auth';
import { currentUserChecker } from 'auth/current-user-checker.auth';
import { env } from 'env';

export const expressLoader: MicroframeworkLoader = (
  settings: MicroframeworkSettings | undefined,
) => {
  if (!settings) return;

  const app = settings.getData('express_app');
  useExpressServer(app, {
    cors: true,
    classTransformer: true,
    routePrefix: env.app.routePrefix,
    defaultErrorHandler: false,
    /**
     * We can add options about how routing-controllers should configure itself.
     * Here we specify what controllers should be registered in our express server.
     */
    controllers: env.app.dirs.controllers,
    middlewares: env.app.dirs.middlewares,
    interceptors: env.app.dirs.interceptors,

    /**
     * Authorization features
     */
    authorizationChecker: authorizationChecker(),
    currentUserChecker: currentUserChecker(),
  });
};
