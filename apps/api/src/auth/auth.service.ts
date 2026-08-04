import { PrismaService } from "src/prisma/prisma.service";
import { RegisterRequestDto } from "./dto/register-request.dto";
import { PasswordService } from "./password.service";
import { Injectable, UnauthorizedException } from "@nestjs/common";
import { LoginRequestDto } from "./dto/login-request.dto";
import { JwtService } from "@nestjs/jwt";
import { AuthResponseDto, AuthUserDto } from "./dto/auth-response.dto";

@Injectable()
export class AuthService {
    constructor(private readonly prismaService: PrismaService, private readonly passwordService: PasswordService, private readonly jwtService: JwtService) { }

    async register(dto: RegisterRequestDto) {
        const newRegister = await this.prismaService.user.create({
            data: {
                email: dto.email,
                password: await this.passwordService.hashPassword(dto.password),
                username: dto.username,
            },
        });

        const jwt = await this.generateJwt(newRegister.id, newRegister.email);
        const authUser = new AuthUserDto(newRegister, jwt);

        return new AuthResponseDto(authUser);
    }

    async login(dto: LoginRequestDto) {
        const user = await this.prismaService.user.findUnique({
            where: {
                email: dto.email,
            },
        });

        if (!user) {
            throw new UnauthorizedException('Invalid credentials');
        }

        const isMatch = await this.passwordService.comparePassword(dto.password, user.password);
        if (!isMatch) {
            throw new UnauthorizedException('Invalid credentials');
        }

        const jwt = await this.generateJwt(user.id, user.email);
        const authUser = new AuthUserDto(user, jwt);

        return new AuthResponseDto(authUser);
    }

    private async generateJwt(userId: number, email: string): Promise<string> {
        const payload = { sub: userId, email };
        const token = await this.jwtService.signAsync(payload);

        return token;
    }
}