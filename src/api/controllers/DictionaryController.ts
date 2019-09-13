import {Body, Delete, Get, JsonController, OnUndefined, Param, Post, Put, QueryParam} from 'routing-controllers';
import {Word} from '../models/Word';
import {DictionaryService} from '../services/DictionaryService';
import {WordNotFoundError} from '../errors/WordNotFoundError';

@JsonController('/word-list')
export class DictionaryController {

  constructor(
    private dictionaryService: DictionaryService
  ) { }

  @Get('')
  public async getList(@QueryParam('limit') limit: number,
                       @QueryParam('offset') offset: number,
                       @QueryParam('search') search: string): Promise<{totalCount: number; items: Word[]}> {
    return this.dictionaryService.getWordList(limit, offset, search);
  }

  @Get('/:id/word')
  @OnUndefined(WordNotFoundError)
  public one(@Param('id') id: number): Promise<Word | undefined> {
    return this.dictionaryService.findOne(id);
  }

  @Post('/word')
  public create(@Body() dictionary: Word): Promise<Word> {
    return this.dictionaryService.create(dictionary);
  }

  @Put('/:id/word')
  @OnUndefined(WordNotFoundError)
  public update(@Param('id') id: number, @Body() user: Word): Promise<Word> {
    return this.dictionaryService.update(id, user);
  }

  @Delete('/:id/word')
  @OnUndefined(WordNotFoundError)
  public delete(@Param('id') id: number): Promise<any> {
    return this.dictionaryService.delete(id)
      .catch();
  }

}
