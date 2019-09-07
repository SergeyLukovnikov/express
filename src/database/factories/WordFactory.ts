import * as Faker from 'faker';
import { define } from 'typeorm-seeding';
import * as uuid from 'uuid';

import { Word } from '../../../src/api/models/Word';

define(Word, (faker: typeof Faker, settings: { role: string }) => {
    const word = new Word();
    word.id = uuid.v1();
    word.name = faker.random.words(1);
    word.translation = faker.random.words(1);
    return word;
});
