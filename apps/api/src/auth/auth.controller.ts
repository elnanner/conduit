import { Body, Controller, Get, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';

@Controller('users')
export class AuthController {
    constructor(private readonly authService: AuthService) { }

    @Get()
    ping() {
        return { status: 'ok' };
    }
    
    @Get('all')
    async getAllUsers() {
        return await this.authService.getUsers();
    }

    @Post()
    async createUser(@Body() dto: RegisterDto) {
        return await this.authService.register(dto);
    }
}
