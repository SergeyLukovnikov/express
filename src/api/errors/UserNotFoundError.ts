import {ResponseError} from './ResponseError';

export class UserNotFoundError extends ResponseError {
  public errorCode = 'USER_NOT_FOUND';

  constructor() {
    super(404, 'User not found!');
  }
}
