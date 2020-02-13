import {Service} from 'typedi';
import {env} from '../../env';

@Service()
export class AuthService {

  public login(login: string, password: string): Promise<any> {
    const secretKey = env.auth.secretKey;
    console.log(secretKey);
    return Promise.resolve();
  }
}
