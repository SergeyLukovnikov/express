import {ResponseError} from './ResponseError';

export class WordAlreadyExistError extends ResponseError {
  public errorCode = 'WORD_ALREADY_EXIST';

  constructor(message: string = 'Word already exist') {
    super(400, message);
  }
}
