import {ResponseError} from './ResponseError';

export class WordNotFoundError extends ResponseError {
  public errorCode = 'WORD_NOT_FOUND';

  constructor() {
    super(404, 'Word not found!');
  }
}
