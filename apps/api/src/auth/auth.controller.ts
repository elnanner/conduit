import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterRequestDto } from './dto/register-request.dto';
import { LoginRequestDto } from './dto/login-request.dto';
import { AuthGuard } from '@nestjs/passport';
import { CurrentUser } from './current-user.decorator';

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

    @Get('me')
    @UseGuards(AuthGuard('jwt'))
    async getCurrentUser(@CurrentUser() user: { id: number; email: string; username: string; bio: string | null; profileImage: string | null }) {
        return { user };
    }
}