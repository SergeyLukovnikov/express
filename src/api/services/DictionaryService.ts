import {Service} from 'typedi';
import {OrmRepository} from 'typeorm-typedi-extensions';
import {EventDispatcher, EventDispatcherInterface} from '../../decorators/EventDispatcher';
import {Logger, LoggerInterface} from '../../decorators/Logger';
import {Word} from '../models/Word';
import {events} from '../subscribers/events';
import {DictionaryRepository} from '../repositories/DictionaryRepository';
import {WordNotFoundError} from '../errors/WordNotFoundError';

@Service()
export class DictionaryService {

  constructor(
    @OrmRepository() private dictionaryRepository: DictionaryRepository,
    @EventDispatcher() private eventDispatcher: EventDispatcherInterface,
    @Logger(__filename) private log: LoggerInterface
  ) { }

  public getWordList(limit: number, offset: number, search: string): Promise<{totalCount: number, items: Word[]}> {
    this.log.info('Get word list');
    return Promise.all([
      !search ? this.totalCount() : this.totalCountSearchedWords(search),
      !search ? this.getWords(limit, offset) : this.getSearchedWords(search, limit, offset),
    ])
    .then(([totalCount, items]) => ({totalCount, items}));
  }

  public findOne(id: number): Promise<Word | undefined> {
    this.log.info('Find one word');
    return this.dictionaryRepository.findOne({ id });
  }

  public async create(word: Word): Promise<Word> {
    this.log.info('Create a new word => ', word.toString());
    const newWord = await this.dictionaryRepository.save(word);
    this.eventDispatcher.dispatch(events.word.created, newWord);
    return newWord;
  }

  public update(id: number, word: Word): Promise<Word> {
    this.log.info('Update a word');
    word.id = id;
    return this.dictionaryRepository.save(word);
  }

  public delete(id: number): Promise<Word> {
    this.log.info('Delete a word');

    return this.findOne(id)
      .then(word => {
        if (word === undefined) {
          throw new WordNotFoundError();
        }
        return word;
      })
      .then(word => this.dictionaryRepository.remove(word));
  }

  private getSearchedWords(search: string, limit: number, offset: number): Promise<Word[]> {
    return this.dictionaryRepository.createQueryBuilder('word')
      .select([
        'word.id',
        'word.word',
        'word.translation',
      ])
      .where(`word LIKE '%${search}%'`)
      .orWhere(`translation LIKE '%${search}%'`)
      .limit(limit)
      .offset(offset)
      .orderBy('id', 'DESC')
      .getMany();
  }

  private getWords(limit: number, offset: number): Promise<Word[]> {
    return this.dictionaryRepository.createQueryBuilder('word')
      .select([
        'word.id',
        'word.word',
        'word.translation',
      ])
      .limit(limit)
      .offset(offset)
      .orderBy('id', 'DESC')
      .getMany();
  }

  private totalCount(): Promise<number> {
    return this.dictionaryRepository.count();
  }

  private totalCountSearchedWords(search: string): Promise<number> {
    return this.dictionaryRepository.createQueryBuilder('word')
      .select()
      .where(`word LIKE '%${search}%'`)
      .orWhere(`translation LIKE '%${search}%'`)
      .getCount();
  }

}
