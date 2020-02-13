import {ResponseError} from './ResponseError';

export class CategoryNotFoundError extends ResponseError {
  public errorCode = 'CATEGORY_NOT_FOUND';

  constructor() {
    super(404, 'Category not found!');
  }
}
