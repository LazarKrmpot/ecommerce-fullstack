import { env } from 'env';

export const getURL = () => {
  if (env.node === 'local') {
    return `${env.app.schema}://${env.app.host}:${env.app.port}`;
  }

  return `${env.app.schema}://${env.app.host}`;
};
