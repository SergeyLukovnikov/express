import {EntityRepository, Repository} from 'typeorm';
import {Word} from '../models/Word';

@EntityRepository(Word)
export class DictionaryRepository extends Repository<Word>  {

}
