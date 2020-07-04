import {Service} from 'typedi';
import {OrmRepository} from 'typeorm-typedi-extensions';
import {Category} from '../models/Category';
import {CategoryRepository} from '../repositories/CategoryRepository';
import {Logger, LoggerInterface} from '../../decorators/Logger';
import {BaseService} from './BaseService';
import {CategoryAlreadyExistError} from '../errors/CategoryAlreadyExistError';

@Service()
export class CategoryService extends BaseService {

  constructor(@OrmRepository() private categoryRepository: CategoryRepository,
              @Logger(__filename) private log: LoggerInterface) {
    super();
  }

  public getCategories(limit: number, offset: number, search: string, sort: string, direction: string): Promise<Category[]> {
    this.log.info('Get categories');

    const sortValue = this.getSortField(sort, ['id', 'name'], 'id');
    const sortOrder = this.getSortOrder(direction, 'DESC');

    const select = this.categoryRepository.createQueryBuilder('category')
      .select([
        'category.id',
        'category.name',
      ])
      .take(limit)
      .skip(offset)
      .orderBy(sortValue, sortOrder)
      .loadRelationCountAndMap('category.wordCount', 'category.words');

    if (search) {
      select.where(`category.name LIKE '%${search}%'`);
    }

    return select.getMany();
  }

  public getCountCategories(search: string): Promise<number> {
    this.log.info('Get count categories');
    const select = this.categoryRepository.createQueryBuilder('category');

    if (search) {
      select.where(`category.name LIKE '%${search}%'`);
    }

    return select.getCount();
  }

  public getCategoryById(id: number): Promise<Category> {
    this.log.info('Get category');

    return this.categoryRepository.createQueryBuilder('category')
      .loadRelationCountAndMap('category.wordCount', 'category.words')
      .where('category.id = :id', {id})
      .getOne();
  }

  public async create(category: Category): Promise<Category> {
    this.log.info('Create category');
    const id = await this.categoryRepository.save(category)
      .then(data => data.id)
      .catch(() => {
        throw new CategoryAlreadyExistError();
      });

    return this.getCategoryById(id);
  }

  public async updateCategory(data: Category): Promise<Category> {
    this.log.info('Update category');
    const categoryId = await this.categoryRepository.save(data)
      .then(category => category.id)
      .catch(() => {
        throw new CategoryAlreadyExistError();
      });

    return this.getCategoryById(categoryId);
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

  public async deleteCategories(ids: number[]): Promise<number[]> {
    this.log.info('Delete categories');
    await this.categoryRepository.delete(ids);

    return Promise.resolve(ids);
  }

  public async deleteWords(id: number, wordIds: number[]): Promise<any> {
    this.log.info('Delete words from category');

    const category = await this.categoryRepository.createQueryBuilder('category')
      .select([
        'category.id',
        'category.name',
      ])
      .leftJoinAndSelect('category.words', 'word')
      .where('category.id = :id', {id})
      .getOne();

    const ids = wordIds ? wordIds : [];
    category.words = category.words.filter(word => ids.indexOf(word.id) === -1);

    return this.categoryRepository.save(category);
  }

}
