// src/auth/auth.module.ts

import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt'; // 👈 Import JwtModule
import { UserModule } from 'src/user/user.module'; // 👈 Import UserModule
import { AuthService } from './auth.service';
// ... other imports (e.g., JwtStrategy, AuthController)

@Module({
  imports: [
    UserModule, // 1. Import UserModule to access UserService (which has UserRepository)
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.register({
      // 2. Configure JwtModule (use environment variables in a real app)
      secret: 'timi11?#',
      signOptions: { expiresIn: '60s' }, // e.g., token expiration
    }),
  ],
  providers: [
    AuthService,
    // ... JwtStrategy, LocalStrategy, etc.
  ],
  exports: [
    // 3. Export all providers needed by other modules (like TodolistModule)
    AuthService,
    JwtModule, // 👈 Export JwtModule to provide JwtService
    UserModule, // 👈 Export UserModule so consumers get access to UserService
  ],
})
export class AuthModule {}
