import http2 from 'http';

import express from 'express';
import {
  MicroframeworkLoader,
  MicroframeworkSettings,
} from 'microframework-w3tec';

import { env } from 'env';

export const serverLoader: MicroframeworkLoader = async (
  settings: MicroframeworkSettings | undefined,
) => {
  if (!settings) return;

  const app = express();
  const server = http2.createServer({}, app);

  // Here we can set the data for other loaders
  settings.setData('server', server);
  settings.setData('express_app', app);
};

export const serverStartLoader: MicroframeworkLoader = async (
  settings: MicroframeworkSettings | undefined,
) => {
  if (!settings) return;

  const server = settings.getData('server');
  server.listen(env.app.port);

  settings.onShutdown(() => {
    server.close();
  });
};
