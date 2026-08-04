import { User } from "generated/prisma/client";

export class AuthUserDto {
  email: string;
  token: string;
  username: string;
  bio: string | null;
  profileImage: string | null;

  constructor(user: User, token: string) {
    this.email = user.email;
    this.token = token;
    this.username = user.username;
    this.bio = user.bio;
    this.profileImage = user.profileImage;
  }
}

export class AuthResponseDto {
  user: AuthUserDto;

  constructor(user: AuthUserDto) {
    this.user = user;
  }
}