import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { ProfileDto } from './dto/profile.dto';

@Injectable()
export class UsersService {
    constructor(private readonly prismaService: PrismaService) { }

    async getProfile(username: string, currentUserId?: number) {
        const user = await this.findUserByUsernameOrThrow(username)

        if (!user) {
            throw new NotFoundException("User not found");
        }

        let following = false;
        if (currentUserId !== undefined) {
            const followRecord = await this.prismaService.follow.findUnique({
                where: {
                    followerId_followingId: {
                        followerId: currentUserId,
                        followingId: user.id
                    },
                },
            });

            following = followRecord !== null;
        }

        return new ProfileDto(user, following);

    }

    async follow(targetUsername: string, currentUserId: number) {
        const targetUser = await this.findUserByUsernameOrThrow(targetUsername);

        if (targetUser.id === currentUserId) {
            throw new BadRequestException("You cannot follow yourself");
        }

        await this.prismaService.follow.upsert({
            where: {
                followerId_followingId: {
                    followerId: currentUserId,
                    followingId: targetUser.id,
                },
            },
            update: {},
            create: {
                followerId: currentUserId,
                followingId: targetUser.id,
            },
        });

        return new ProfileDto(targetUser, true);
    }

    async unfollow(targetUsername: string, currentUserId: number) {
        const targetUser = await this.findUserByUsernameOrThrow(targetUsername);

        await this.prismaService.follow.deleteMany({
            where: {
                followerId: currentUserId,
                followingId: targetUser.id,
            },
        });

        return new ProfileDto(targetUser, false);
    }


    private async findUserByUsernameOrThrow(username: string) {
        const user = await this.prismaService.user.findUnique({ where: { username } });

        if (!user) {
            throw new NotFoundException("User not found");
        }

        return user;
    }
}
