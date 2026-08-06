import { User } from "generated/prisma/client";

export class ProfileDto {
    username: string;
    bio: string | null;
    profileImage: string | null;
    following: boolean;

    constructor(user: User, following: boolean) {
        this.username = user.username;
        this.bio = user.bio;
        this.profileImage = user.profileImage;
        this.following = following;
    }
}