import {Service} from 'typedi';
import {OrmRepository} from 'typeorm-typedi-extensions';
import {EventDispatcher, EventDispatcherInterface} from '../../decorators/EventDispatcher';
import {Logger, LoggerInterface} from '../../decorators/Logger';
import {Word} from '../models/Word';
import {events} from '../subscribers/events';
import {WordRepository} from '../repositories/WordRepository';
import {Brackets} from 'typeorm';
import {CategoryService} from './CategoryService';
import {BaseService} from './BaseService';
import {WordAlreadyExistError} from '../errors/WordAlreadyExistError';

@Service()
export class WordService extends BaseService {

  constructor(@OrmRepository() private wordRepository: WordRepository,
              @EventDispatcher() private eventDispatcher: EventDispatcherInterface,
              private categoryService: CategoryService,
              @Logger(__filename) private log: LoggerInterface) {
    super();
  }

  public getWords(limit: number, offset: number, search: string, sort: string, direction: string): Promise<Word[]> {
    this.log.info('Get words');
    const sortValue = `word.${this.getSortField(sort, ['id', 'value', 'translations'], 'id')}`;
    const sortOrder = this.getSortOrder(direction, 'DESC');

    const select = this.wordRepository.createQueryBuilder('word')
      .select([
        'word.id',
        'word.value',
        'word.translation',
      ])
      .take(limit)
      .skip(offset)
      .orderBy(sortValue, sortOrder)
      .leftJoinAndSelect('word.categories', 'categories');

    if (search) {
      select.where(`word.value LIKE '%${search}%'`)
        .orWhere(`word.translation LIKE '%${search}%'`);
    }

    return select.getMany();
  }

  public getCountWords(search: string): Promise<number> {
    this.log.info('Get count words');
    const select = this.wordRepository.createQueryBuilder('word');

    if (search) {
      select.where(`word.value LIKE '%${search}%'`)
        .orWhere(`word.translation LIKE '%${search}%'`);
    }

    return select.getCount();
  }

  public async createWord(word: Word): Promise<Word> {
    this.log.info('Create a new word => ', word.toString());
    const newWord = await this.wordRepository.save(word);
    this.eventDispatcher.dispatch(events.word.created, newWord);
    return newWord;
  }

  public updateWord(word: Word): Promise<Word> {
    this.log.info('Update a word');

    return this.categoryService.createCategories(word.categories)
      .then(categories => {
        word.categories = categories;
        return this.wordRepository.save(word);
      })
      .catch(() => {
        throw new WordAlreadyExistError();
      });
  }

  public async deleteWords(ids: number[]): Promise<number[]> {
    this.log.info('Delete words');
    await this.wordRepository.delete(ids);

    return Promise.resolve(ids);
  }

  public getWordsByCategory(id: number, limit: number, offset: number, search: string, sort: string, direction: string): Promise<Word[]> {
    this.log.info('Get words by category');
    const select = this.wordRepository.createQueryBuilder('word')
      .select([
        'word.id',
        'word.value',
        'word.translation',
      ])
      .leftJoin('word.categories', 'category')
      .where('category.id =:id', {id});

    if (search) {
      select.andWhere(new Brackets(qb => {
        qb.where(`word.value LIKE '%${search}%'`)
          .orWhere(`word.translation LIKE '%${search}%'`);
      }));
    }

    const sortField = sort ? sort : 'id';
    const order = direction === 'asc' ? 'ASC' : 'DESC';

    return select
      .take(limit)
      .skip(offset)
      .orderBy(`word.${sortField}`, order)
      .getMany();
  }

  public getCountWordsInCategory(id: number, search: string): Promise<number> {
    this.log.info('Get count words in category');
    const select = this.wordRepository.createQueryBuilder('word')
      .select([
        'word.id',
      ])
      .leftJoin('word.categories', 'category')
      .where('category.id = :id', {id});

    if (search) {
      select.andWhere(new Brackets(qb => {
        qb.where(`word.value LIKE '%${search}%'`)
          .orWhere(`word.translation LIKE '%${search}%'`);
      }));
    }

    return select
      .getCount();
  }

}
