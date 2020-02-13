import {Service} from 'typedi';
import {OrmRepository} from 'typeorm-typedi-extensions';
import {EventDispatcher, EventDispatcherInterface} from '../../decorators/EventDispatcher';
import {Logger, LoggerInterface} from '../../decorators/Logger';
import {Word} from '../models/Word';
import {events} from '../subscribers/events';
import {WordRepository} from '../repositories/WordRepository';
import {Brackets, DeleteResult} from 'typeorm';
import {CategoryService} from './CategoryService';

@Service()
export class WordService {

  constructor(@OrmRepository() private wordRepository: WordRepository,
              @EventDispatcher() private eventDispatcher: EventDispatcherInterface,
              private categoryService: CategoryService,
              @Logger(__filename) private log: LoggerInterface
  ) { }

  public getWords(limit: number, offset: number, search: string): Promise<Word[]> {
    this.log.info('Get words');

    const select = this.wordRepository.createQueryBuilder('word')
      .select([
        'word.id',
        'word.value',
        'word.translation',
      ])
      .limit(limit)
      .offset(offset)
      .orderBy('word.id', 'DESC')
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
      });
  }

  public deleteWords(ids: number[]): Promise<DeleteResult> {
    this.log.info('Delete words');
    return this.wordRepository.delete(ids);
  }

  public getWordsByCategory(id: number, limit: number, offset: number, search: string): Promise<Word[]> {
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

    return select
      .limit(limit)
      .offset(offset)
      .orderBy('word.id', 'DESC')
      .getMany();
  }

  public getCountWordsInCategory(id: number, search: string): Promise<number> {
    this.log.info('Get count words in category');
    const select = this.wordRepository.createQueryBuilder('word')
      .select([
        'word.id',
      ])
      .leftJoin('word.categories', 'category')
      .where('category.id =:id', {id});

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
