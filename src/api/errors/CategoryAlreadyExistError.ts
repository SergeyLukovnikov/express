import {ResponseError} from './ResponseError';

export class CategoryAlreadyExistError extends ResponseError {
  public errorCode = 'CATEGORY_ALREADY_EXIST';

  constructor(message: string = 'Category already exist') {
    super(400, message);
  }
}
