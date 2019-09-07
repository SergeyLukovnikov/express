import {Body, Delete, Get, JsonController, OnUndefined, Param, Post, Put, Req} from 'routing-controllers';

import { UserNotFoundError } from '../errors/UserNotFoundError';
import { Word } from '../models/Word';
import { WordService } from '../services/WordService';

@JsonController('/words')
export class WordController {

    constructor(
        private wordService: WordService
    ) { }

    @Get()
    public find(): Promise<Word[]> {
        return this.wordService.find();
    }

    @Get('/me')
    public findMe(@Req() req: any): Promise<Word[]> {
        return req.user;
    }

    @Get('/:id')
    @OnUndefined(UserNotFoundError)
    public one(@Param('id') id: string): Promise<Word | undefined> {
        return this.wordService.findOne(id);
    }

    @Post()
    public create(@Body() user: Word): Promise<Word> {
        return this.wordService.create(user);
    }

    @Put('/:id')
    public update(@Param('id') id: string, @Body() user: Word): Promise<Word> {
        return this.wordService.update(id, user);
    }

    @Delete('/:id')
    public delete(@Param('id') id: string): Promise<void> {
        return this.wordService.delete(id);
    }

}
