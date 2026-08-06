import { Controller, Delete, Get, Param, Post, UseGuards } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { UsersService } from "./users.service";
import { OptionalJwtAuthGuard } from "src/auth/optional-jwt-auth.guard";
import { CurrentUser } from "src/auth/current-user.decorator";

type AuthenticatedUser = { id: number };

@Controller("profiles")
export class UsersController {
    constructor(private readonly usersService: UsersService) { }

    @Get(":username")
    @UseGuards(OptionalJwtAuthGuard)
    async getProfile(
        @Param("username") username: string,
        @CurrentUser() user: AuthenticatedUser | undefined,
    ) {
        return await this.usersService.getProfile(username, user?.id);
    }

    @Post(":username/follow")
    @UseGuards(AuthGuard("jwt"))
    async follow(@Param("username") username: string, @CurrentUser() user: AuthenticatedUser) {
        return await this.usersService.follow(username, user.id);
    }

    @Delete(":username/follow")
    @UseGuards(AuthGuard("jwt"))
    async unfollow(@Param("username") username: string, @CurrentUser() user: AuthenticatedUser) {
        return await this.usersService.unfollow(username, user.id);
    }
}