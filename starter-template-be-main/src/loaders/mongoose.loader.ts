import {
  MicroframeworkLoader,
  MicroframeworkSettings,
} from 'microframework-w3tec';
import { connect, set } from 'mongoose';

import { env } from 'env';

export const mongooseLoader: MicroframeworkLoader = async (
  settings: MicroframeworkSettings | undefined,
) => {
  const connection = await connect(env.db.uri, {});
  set('debug', env.db.logging);

  if (!settings) return;

  settings.setData('connection', connection);
  settings.onShutdown(() => connection.disconnect());
};
