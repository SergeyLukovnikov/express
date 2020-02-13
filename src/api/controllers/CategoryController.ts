import {Body, Delete, Get, JsonController, OnUndefined, Post, Put, QueryParam} from 'routing-controllers';
import {CategoryService} from '../services/CategoryService';
import {Category} from '../models/Category';
import {ListInterface} from './responses/ListInterface';
import {DeleteResult} from 'typeorm';
import {CategoryNotFoundError} from '../errors/CategoryNotFoundError';

@JsonController('/categories')
export class CategoryController {

  constructor(private categoryService: CategoryService) { }

  @Get('')
  public getCategories(@QueryParam('limit') limit: number,
                       @QueryParam('offset') offset: number,
                       @QueryParam('search') search: string): Promise<ListInterface<Category>> {
    const items = this.categoryService.getCategories(limit, offset, search);
    const totalCount = this.categoryService.getCountCategories(search);

    return Promise.all([items, totalCount])
      .then(([itemsRes, totalCountRes]) => ({items: itemsRes, totalCount: totalCountRes}));
  }

  @Post('')
  public createCategory(@Body() category: Category): Promise<Category> {
    return this.categoryService.create(category);
  }

  @Put('/:id')
  @OnUndefined(CategoryNotFoundError)
  public updateCategory(@Body() category: Category): Promise<Category> {
    return this.categoryService.updateCategory(category);
  }

  @Delete('')
  public deleteCategories(@QueryParam('ids') ids: number[]): Promise<DeleteResult> {
    return this.categoryService.deleteCategories(ids);
  }

}
