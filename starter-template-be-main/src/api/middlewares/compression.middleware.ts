import compression from 'compression';
import * as express from 'express';
import { ExpressMiddlewareInterface, Middleware } from 'routing-controllers';

@Middleware({ type: 'before' })
export class CompressionMiddleware implements ExpressMiddlewareInterface {
  public use(
    req: express.Request,
    res: express.Response,
    next: express.NextFunction,
  ) {
    return compression()(req, res, next);
  }
}
