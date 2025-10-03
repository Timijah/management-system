import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { UserService } from 'src/user/user.service';
import { User } from 'src/user/userSchema/user.schema';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(private userService: UserService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.JWTSECRET,
    });
  }

  async validate(payload: { email }): Promise<User> {
    const { email } = payload;
    const user = await this.userService.findEmail(email);
    if (!user) {
      throw new UnauthorizedException('Login first to access this endpoint');
    }
    return user;
  }
  //jwt strategy is a component there that is in charge of authentication and authorization. it protects api routes using json web token
}
