import {
  MicroframeworkLoader,
  MicroframeworkSettings,
} from 'microframework-w3tec';
import { SocketControllers } from 'socket-controllers';
import { Server } from 'socket.io';
import Container from 'typedi';

import { env } from 'env';

export const socketLoader: MicroframeworkLoader = async (
  settings: MicroframeworkSettings | undefined,
) => {
  if (!settings) return;

  const server = settings.getData('server');

  const socketServer = new SocketControllers({
    io: new Server(server, {
      cors: {
        origin: '*',
      },
    }),
    container: Container,
    controllers: env.app.dirs.sockets,
    middlewares: env.app.dirs.socketsMiddlewares,
  });

  settings.onShutdown(() => {
    return new Promise((resolve, reject) => {
      socketServer.io.close((err) => {
        if (err) {
          return reject(err);
        }

        resolve(undefined);
      });
    });
  });
  global.io = socketServer.io;
};
