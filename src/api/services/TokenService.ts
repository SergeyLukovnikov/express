import {Service} from 'typedi';
import {OrmRepository} from 'typeorm-typedi-extensions';
import {Logger, LoggerInterface} from '../../decorators/Logger';
import {RefreshTokenRepository} from '../repositories/RefreshToken';
import {RefreshToken} from '../models/RefreshToken';

@Service()
export class TokenService {

  constructor(@OrmRepository() private refreshTokenRepository: RefreshTokenRepository,
              @Logger(__filename) private log: LoggerInterface) {
  }

  public async add(token: RefreshToken): Promise<RefreshToken> {
    this.log.info('Add token');
    return this.refreshTokenRepository.save(token);
  }

}
