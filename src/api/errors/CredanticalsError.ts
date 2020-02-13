import {ResponseError} from './ResponseError';

export class CredentialsError extends ResponseError {
  public errorCode = 'INVALID_CREDENTIALS';

  constructor() {
    super(403, 'Invalid login or password!');
  }
}
