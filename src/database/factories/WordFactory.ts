import * as Faker from 'faker';
import {define} from 'typeorm-seeding';

import {Word} from '../../api/models/Word';

define(Word, (faker: typeof Faker) => {
  const word = new Word();
  word.value = faker.random.words(1);
  word.translation = faker.random.words(1);
  return word;
});
