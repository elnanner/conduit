import { PrismaService } from "src/prisma/prisma.service";
import { RegisterDto } from "./dto/register.dto";
import { PasswordService } from "./password.service";
import { Injectable } from "@nestjs/common";

@Injectable()
export class AuthService {
    constructor(private readonly prismaService: PrismaService, private readonly PasswordService: PasswordService) { }

    async register(dto: RegisterDto) {
        const newRegister = await this.prismaService.user.create({
            data: {
                email: dto.email,
                password: await this.PasswordService.hashPassword(dto.password),
                username: dto.username,
            },
        });

        const { password, ...usuarioSinPassword } = newRegister;
        return usuarioSinPassword;
    }

    async getUsers() {
        return await this.prismaService.user.findMany();
    }
}