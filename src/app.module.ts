import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';

import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';
import { JwtModule } from '@nestjs/jwt';
import { AuthMiddleware } from './middlewares/auth/auth.middleware';
import { TodolistModule } from './todolist/todolist.module';

@Module({
  imports: [
    ThrottlerModule.forRoot({
      throttlers: [
        {
          //this sets the time to live to 60 seconds. 10000ms = 10 sec
          ttl: 10000,
          // I can only send 2 requests in 10 seconds
          limit: 2,
        },
      ],
    }),
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'timi11?#',
      signOptions: { expiresIn: '1d' }, // optional
    }),
    UserModule,
    // ProductModule,
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get<string>('DB_HOST'),
        port: configService.get<number>('DB_PORT'),
        username: configService.get<string>('DB_USERNAME'),
        password: configService.get<string>('DB_PASSWORD'),
        database: configService.get<string>('DB_NAME'),
        entities: [__dirname + '/**/*.entity{.ts,.js}'],
        synchronize: configService.get<boolean>('DB_SYNCHRONIZE'),
      }),
    }),
    TodolistModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    //here I have set up my throttler guard for the entire application(globally)

    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    //this  means for every route inside the app module apply this middleware

    //this method here is only for the route
    // consumer.apply(AuthMiddleware).forRoutes('/auth', '/');

    consumer
      .apply(AuthMiddleware)
      .exclude('/auth')
      .forRoutes({ path: '*', method: RequestMethod.GET });
  }
}
