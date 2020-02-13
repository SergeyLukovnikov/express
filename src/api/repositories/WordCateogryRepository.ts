import {EntityRepository, Repository} from 'typeorm';
import {WordCategory} from '../models/WordCategory';

@EntityRepository(WordCategory)
export class WordCategoryRepository extends Repository<WordCategory>  {

}
