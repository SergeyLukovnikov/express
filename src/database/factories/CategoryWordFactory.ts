import * as Faker from 'faker';
import {define} from 'typeorm-seeding';
import {WordCategory} from '../../api/models/WordCategory';

define(WordCategory, (faker: typeof Faker) => {
  const category = new WordCategory();
  category.categoryId = faker.random.number();
  category.wordId = faker.random.number();
  return category;
});
