import {HttpError} from 'routing-controllers';

export class WordNotFoundError extends HttpError {
  constructor() {
    super(404, 'Word not found!');
  }
}
