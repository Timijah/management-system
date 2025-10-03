import { Injectable, UnauthorizedException } from '@nestjs/common';

@Injectable()
export class AuthService {
  private readonly user = {
    username: 'tj',
    password: '1234',
  };

  validateUser(username: string, password: string) {
    if (username === this.user.username && password === this.user.password) {
      return { username };
    }
    throw new UnauthorizedException('Invalid credentials');
  }
}
