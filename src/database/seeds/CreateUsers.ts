import {Factory} from 'typeorm-seeding';

import {User} from '../../api/models/User';

export class CreateUsers {

    public async seed(factory: Factory): Promise<any> {
        await factory(User)().seedMany(10);
    }

}
