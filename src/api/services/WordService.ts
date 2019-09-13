import {Service} from 'typedi';
import {OrmRepository} from 'typeorm-typedi-extensions';

import {EventDispatcher, EventDispatcherInterface} from '../../decorators/EventDispatcher';
import {Logger, LoggerInterface} from '../../decorators/Logger';
import {Word} from '../models/Word';
import {WordRepository} from '../repositories/WordRepository';
import {events} from '../subscribers/events';

@Service()
export class WordService {

  constructor(
    @OrmRepository() private wordRepository: WordRepository,
    @EventDispatcher() private eventDispatcher: EventDispatcherInterface,
    @Logger(__filename) private log: LoggerInterface
  ) { }

  public getWordList(limit: number, offset: number): Promise<{totalCount: number, items: Word[]}> {
    this.log.info('Find all words');
    return Promise.all([this.totalCount(), this.getItems(limit, offset)])
      .then(([totalCount, items]) => ({totalCount, items}));
  }

  public findOne(id: number): Promise<Word | undefined> {
    this.log.info('Find one word');
    return this.wordRepository.findOne({ id });
  }

  public async create(word: Word): Promise<Word> {
    this.log.info('Create a new word => ', word.toString());
    const newWord = await this.wordRepository.save(word);
    this.eventDispatcher.dispatch(events.word.created, newWord);
    return newWord;
  }

  public update(id: number, word: Word): Promise<Word> {
    this.log.info('Update a word');
    word.id = id;
    return this.wordRepository.save(word);
  }

  public async delete(id: string): Promise<void> {
    this.log.info('Delete a word');
    await this.wordRepository.delete(id);
    return;
  }

  private getItems(limit: number, offset: number): Promise<Word[]> {
    return this.wordRepository.createQueryBuilder('word')
      .select([
        'word.id',
        'word.name',
        'word.translation',
      ])
      .limit(limit)
      .offset(offset)
      .getMany();
  }

  private totalCount(): Promise<number> {
    return this.wordRepository.count();
  }

}
