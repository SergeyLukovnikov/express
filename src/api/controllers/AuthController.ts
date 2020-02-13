import {Body, JsonController, OnUndefined, Post} from 'routing-controllers';
import {UserNotFoundError} from '../errors/UserNotFoundError';
import * as jwtwebtoken from 'jsonwebtoken';
import {compareSync} from 'bcrypt';
import {UserService} from '../services/UserService';
import {CredentialsError} from '../errors/CredanticalsError';
// import {AuthService} from '../../auth/AuthService';
import {env} from '../../env';
import {RefreshToken} from '../models/RefreshToken';
import {TokenService} from '../services/TokenService';

@JsonController('/auth')
export class AuthController {

  constructor(private userService: UserService,
              private tokenService: TokenService) {
  }

  @Post('/login')
  @OnUndefined(UserNotFoundError)
  public async login(@Body() credentials: {login: string; password: string; }): Promise<any> {
    const {login, password} = credentials;
    const user  = await this.userService.findByLogin(login);

    if (!user || !compareSync(password, user.password)) {
      throw new CredentialsError();
    }

    const refreshToken = new RefreshToken(user.id);
    await this.tokenService.add(refreshToken);

    return Promise.resolve({
      token: jwtwebtoken.sign({id: user.id}, env.auth.secretKey, {
        expiresIn: env.auth.expireToken,
      }),
      refreshToken: refreshToken.token,
    });
  }

}
