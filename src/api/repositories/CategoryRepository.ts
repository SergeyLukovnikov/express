import {EntityRepository, Repository} from 'typeorm';
import {Category} from '../models/Category';

@EntityRepository(Category)
export class CategoryRepository extends Repository<Category>  {

  public getCategoryByName(name: string): Promise<Category> {
    return this.createQueryBuilder()
      .select('category')
      .from(Category, 'category')
      .where('category.name = :name', { name })
      .getOne();
  }
}
