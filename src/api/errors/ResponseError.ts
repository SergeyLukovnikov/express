import {HttpError} from 'routing-controllers';

export class ResponseError extends HttpError {
  public errorCode: string;

  constructor(code: number, message: string) {
    super(code, message);
  }
}
