import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { PrismaService } from 'src/prisma/prisma.service';

interface JwtPayload {
    sub: number;
    email: string;
}

@Injectable()
export class OptionalJwtStrategy extends PassportStrategy(Strategy, 'jwt-optional') {
    constructor(private readonly prismaService: PrismaService) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: process.env.JWT_SECRET,
        });
    }

    async validate(payload: JwtPayload) {
        const user = await this.prismaService.user.findUnique({
            where: { id: payload.sub },
        });

        if (!user) {
            return null;
        }

        const { password, ...userWithoutPassword } = user;
        return userWithoutPassword;
    }
}