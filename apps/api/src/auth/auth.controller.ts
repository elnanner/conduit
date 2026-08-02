import { Body, Controller, Get, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterRequestDto } from './dto/register-request.dto';
import { LoginRequestDto } from './dto/login-request.dto';

@Controller('users')
export class AuthController {
    constructor(private readonly authService: AuthService) { }

    @Post()
    async createUser(@Body() dto: RegisterRequestDto) {
        return await this.authService.register(dto);
    }

    @Post('login')
    async loginUser(@Body() dto: LoginRequestDto) {
        return await this.authService.login(dto);
    }
}