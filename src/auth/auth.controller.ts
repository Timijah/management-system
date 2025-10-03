import { Controller, Post, Body, Req, Res } from '@nestjs/common';
import { AuthService } from './auth.service';
import type { Request, Response } from 'express';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  login(
    @Body('username') username: string,
    @Body('password') password: string,
    @Req() req: Request,
    @Res() res: Response,
  ) {
    const user = this.authService.validateUser(username, password);

    // Store user in session
    req.session['user'] = user;

    res.send({ message: 'Login successful', user });
  }

  @Post('logout')
  logout(@Req() req: Request, @Res() res: Response) {
    req.session.destroy((err) => {
      if (err) {
        return res.status(500).send({ message: 'Logout failed' });
      }
      res.clearCookie('connect.sid');
      return res.send({ message: 'Logged out successfully' });
    });
  }
}
