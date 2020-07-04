import {Body, Delete, Get, JsonController, OnUndefined, Param, Post, Put, QueryParam} from 'routing-controllers';
import {Word} from '../models/Word';
import {WordService} from '../services/WordService';
import {WordNotFoundError} from '../errors/WordNotFoundError';
import {CategoryService} from '../services/CategoryService';
import {WordAlreadyExistError} from '../errors/WordAlreadyExistError';
import {env} from '../../env';

@JsonController('/words')
export class WordController {

  constructor(private wordService: WordService,
              private categoryService: CategoryService) { }

  @Get()
  public async getWords(@QueryParam('limit') limit: number = +env.data.listLimit,
                        @QueryParam('offset') offset: number = 0,
                        @QueryParam('search') search: string = '',
                        @QueryParam('sort') sort: string = 'id',
                        @QueryParam('direction') direction: string): Promise<{totalCount: number; items: Word[]}> {
    return Promise.all([
      this.wordService.getWords(limit, offset, search, sort, direction),
      this.wordService.getCountWords(search),
    ])
    .then(([items, totalCount]) => ({items, totalCount}));
  }

  @Get('/category/:id')
  public getWordsByCategory(@Param('id') id: number,
                            @QueryParam('limit') limit: number = +env.data.listLimit,
                            @QueryParam('offset') offset: number = 0,
                            @QueryParam('search') search: string = '',
                            @QueryParam('sort') sort: string = 'id',
                            @QueryParam('direction') direction: string): Promise<{totalCount: number; items: Word[]}> {
    return Promise.all([
      this.wordService.getWordsByCategory(id, limit, offset, search, sort, direction),
      this.wordService.getCountWordsInCategory(id, search),
    ])
    .then(([items, totalCount]) => ({items, totalCount}));
  }

  @Post('')
  public createWord(@Body() word: Word): Promise<Word> {
    return this.categoryService.createCategories(word.categories)
      .then(categories => {
        word.categories = categories;
        return this.wordService.createWord(word);
      })
      .catch((error) => {
        throw new WordAlreadyExistError(error.message);
      });
  }

  @Put('/:id')
  @OnUndefined(WordNotFoundError)
  public update(@Param('id') id: number, @Body() word: Word): Promise<Word> {
    return this.wordService.updateWord(word);
  }

  @Delete()
  @OnUndefined(WordNotFoundError)
  public deleteWords(@Body() ids: number[]): Promise<number[]> {
    return this.wordService.deleteWords(ids);
  }

}
