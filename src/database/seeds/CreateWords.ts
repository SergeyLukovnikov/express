import {Connection} from 'typeorm';
import {Factory, Seed, times} from 'typeorm-seeding';

import {Word} from '../../../src/api/models/Word';
import {User} from '../../../src/api/models/User';

export class CreateWords implements Seed {

    public async seed(factory: Factory, connection: Connection): Promise<any> {
        const em = connection.createEntityManager();
        await times(10, async (n) => {
            const word = await factory(Word)().seed();
            const user = await factory(User)().make();
            user.words = [word];
            return await em.save(user);
        });
    }

}
