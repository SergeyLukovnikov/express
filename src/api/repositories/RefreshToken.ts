import {EntityRepository, Repository} from 'typeorm';

import {RefreshToken} from '../models/RefreshToken';

@EntityRepository(RefreshToken)
export class RefreshTokenRepository extends Repository<RefreshToken>  {

}
