import {Service} from 'typedi';
import {OrmRepository} from 'typeorm-typedi-extensions';
import {Category} from '../models/Category';
import {CategoryRepository} from '../repositories/CategoryRepository';
import {Logger, LoggerInterface} from '../../decorators/Logger';
import {DeleteResult} from 'typeorm';

@Service()
export class CategoryService {

  constructor(@OrmRepository() private categoryRepository: CategoryRepository,
              @Logger(__filename) private log: LoggerInterface) {
  }

  public getCategories(limit: number, offset: number, search: string): Promise<Category[]> {
    this.log.info('Get categories');
    const select = this.categoryRepository.createQueryBuilder('category')
      .select([
        'category.id',
        'category.name',
      ])
      .limit(limit)
      .offset(offset)
      .orderBy('category.id', 'ASC')
      .loadRelationCountAndMap('category.wordCount', 'category.words');

    if (search) {
      select.where(`name LIKE '%${search}%'`);
    }

    return select.getMany();
  }

  public getCountCategories(search: string): Promise<number> {
    this.log.info('Get count categories');
    const select = this.categoryRepository.createQueryBuilder('category');

    if (search) {
      select.where(`category LIKE '%${search}%'`);
    }

    return select.getCount();
  }

  public create(category: Category): Promise<Category> {
    this.log.info('Create category');
    return this.categoryRepository.save(category);
  }

  public updateCategory(category: Category): Promise<Category> {
    this.log.info('Update category');
    return this.categoryRepository.save(category);
  }

  public createCategories(categories: Category[]): Promise<Category[]> {
    this.log.info('Create categories');

    if (!categories.length) {
      return Promise.resolve([]);
    }

    return Promise.all(categories.map(category => this.categoryRepository.save(category)
      .catch(() => this.categoryRepository.getCategoryByName(category.name))
    ));
  }

  public deleteCategories(ids: number[]): Promise<DeleteResult> {
    this.log.info('Delete categories');
    return this.categoryRepository.delete(ids);
  }

}
