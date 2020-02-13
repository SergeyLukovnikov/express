import {Body, Delete, Get, JsonController, OnUndefined, Param, Post, Put, QueryParam} from 'routing-controllers';
import {Word} from '../models/Word';
import {WordService} from '../services/WordService';
import {WordNotFoundError} from '../errors/WordNotFoundError';
import {CategoryService} from '../services/CategoryService';
import {WordAlreadyExistError} from '../errors/WordAlreadyExistError';
import {DeleteResult} from 'typeorm';

@JsonController('/words')
export class WordController {

  constructor(private wordService: WordService,
              private categoryService: CategoryService) { }

  @Get()
  public async getWords(@QueryParam('limit') limit: number,
                        @QueryParam('offset') offset: number,
                        @QueryParam('search') search: string): Promise<{totalCount: number; items: Word[]}> {

    const items = this.wordService.getWords(limit, offset, search);
    const totalCount = this.wordService.getCountWords(search);
    return Promise.all([items, totalCount])
      .then(([itemsRes, totalCountRes]) => ({items: itemsRes, totalCount: totalCountRes}));
  }

  @Get('/category/:id')
  public getWordsByCategory(@Param('id') id: number,
                            @QueryParam('limit') limit: number,
                            @QueryParam('offset') offset: number,
                            @QueryParam('search') search: string): Promise<{totalCount: number; items: Word[]}> {
    const items = this.wordService.getWordsByCategory(id, limit, offset, search);
    const totalCount = this.wordService.getCountWordsInCategory(id, search);
    return Promise.all([items, totalCount])
      .then(([itemsRes, totalCountRes]) => ({items: itemsRes, totalCount: totalCountRes}));
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

  @Delete('/delete-words')
  @OnUndefined(WordNotFoundError)
  public deleteWord(@QueryParam('ids') ids: number[]): Promise<DeleteResult> {
    return this.wordService.deleteWords(ids);
  }

}
