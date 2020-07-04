import {Body, Delete, Get, JsonController, OnUndefined, Param, Post, Put, QueryParam} from 'routing-controllers';
import {CategoryService} from '../services/CategoryService';
import {Category} from '../models/Category';
import {ListInterface} from './responses/ListInterface';
import {CategoryNotFoundError} from '../errors/CategoryNotFoundError';
import {env} from '../../env';

@JsonController('/categories')
export class CategoryController {

  constructor(private categoryService: CategoryService) { }

  @Get('')
  public getCategories(@QueryParam('limit') limit: number = +env.data.listLimit,
                       @QueryParam('offset') offset: number = 0,
                       @QueryParam('search') search: string = '',
                       @QueryParam('sort') sort: string = 'id',
                       @QueryParam('direction') direction: string = 'DESC'): Promise<ListInterface<Category>> {
    return Promise.all([
      this.categoryService.getCategories(limit, offset, search, sort, direction),
      this.categoryService.getCountCategories(search),
    ])
    .then(([items, totalCount]) => ({items, totalCount}));
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

  @Post('/:id/words')
  public deleteWords(@Param('id') id: number,
                     @Body() ids: number[]): Promise<any> {
    return this.categoryService.deleteWords(id, ids);
  }

  @Delete('')
  public deleteCategories(@Body() ids: number[]): Promise<number[]> {
    return this.categoryService.deleteCategories(ids);
  }

}
