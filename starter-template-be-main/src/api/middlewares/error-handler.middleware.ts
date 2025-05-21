import * as express from 'express';
import {
  ExpressErrorMiddlewareInterface,
  HttpError,
  Middleware,
} from 'routing-controllers';

import { Logger, LoggerInterface } from 'decorators/logger.decorator';

@Middleware({ type: 'after' })
export class ErrorHandlerMiddleware implements ExpressErrorMiddlewareInterface {
  constructor(@Logger(__filename) private log: LoggerInterface) {}

  public error(
    error: HttpError,
    req: express.Request,
    res: express.Response,
  ): void {
    res.status(error.httpCode || 500);
    res.json({
      name: error.name,
      message: error.message,
      errors: error[`errors`] || [],
    });

    this.log.error(error.name);
    console.log(error.stack);
  }
}
