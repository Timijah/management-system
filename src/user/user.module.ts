import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { User } from './Entity/user.entity';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    JwtModule.register({
      global: true, // makes JwtService available everywhere
      secret: process.env.JWT_SECRET || 'fallbackSecret', // avoid undefined
      signOptions: { expiresIn: '1h' },
    }),
    PassportModule.register({
      defaultStrategy: 'jwt',
      session: false, // JWT is stateless
    }),
  ],
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService, TypeOrmModule],
})
export class UserModule {}
