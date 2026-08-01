import { Module } from '@nestjs/common';
import { PasswordService } from './password.service';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';

@Module({
  providers: [PasswordService, AuthService],
  controllers: [AuthController],
})
export class AuthModule {}
