import * as express from 'express';
import {ExpressErrorMiddlewareInterface, Middleware} from 'routing-controllers';

import {Logger, LoggerInterface} from '../../decorators/Logger';
import {env} from '../../env';
import {ResponseError} from '../errors/ResponseError';

@Middleware({ type: 'after' })
export class ErrorHandlerMiddleware implements ExpressErrorMiddlewareInterface {

  public isProduction = env.isProduction;

  constructor(
    @Logger(__filename) private log: LoggerInterface
  ) { }

  public error(error: ResponseError, req: express.Request, res: express.Response, next: express.NextFunction): void {
    res.status(error.httpCode || 500);
    res.json({
      errorCode: error.errorCode,
      message: error.message,
    });

    if (this.isProduction) {
      this.log.error(error.errorCode, error.message);
    } else {
      this.log.error(error.name, error.stack);
    }

  }

}
