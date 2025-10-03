import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { SkipThrottle, Throttle } from '@nestjs/throttler';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  //skips the throttle configuration in my appModule

  // @SkipThrottle()
  @Get()
  getHello(): string {
    console.log('inside the route handler');
    return this.appService.getHello();
  }

  @SkipThrottle()
  @Get('tj')
  getUsers() {
    return [];
  }

  // Override default configuration for Rate limiting and duration and I defined a new one for this particular route.
  @Throttle({ default: { limit: 6, ttl: 10000 } })
  @Get('tj/posts')
  getUsersPosts() {
    return {};
  }
}
