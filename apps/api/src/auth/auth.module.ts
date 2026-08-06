import { Module } from '@nestjs/common';
import { PasswordService } from './password.service';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from './jwt.strategy';
import { OptionalJwtStrategy } from './optional-jwt.strategy';

@Module({
  imports: [
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: '15m' },
    }),
    PassportModule.register({
      defaultStrategy: 'jwt'
    })],
  providers: [PasswordService, AuthService, JwtStrategy, OptionalJwtStrategy],
  controllers: [AuthController],
})
export class AuthModule { }
