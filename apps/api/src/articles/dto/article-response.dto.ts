import { Article, Tag, User } from "generated/prisma/client";

class AuthorDto {
    username: string;
    bio: string | null;
    profileImage: string | null;

    constructor(user: User) {
        this.username = user.username;
        this.bio = user.bio;
        this.profileImage = user.profileImage;
    }
}

type ArticleWithRelations = Article & {
    author: User;
    tags: Tag[];
};

export class ArticleResponseDto {
    slug: string;
    title: string;
    description: string;
    body: string;
    tagList: string[];
    createdAt: Date;
    updatedAt: Date;
    author: AuthorDto;

    constructor(article: ArticleWithRelations) {
        this.slug = article.slug;
        this.title = article.title;
        this.description = article.description;
        this.body = article.body;
        this.tagList = article.tags.map((tag) => tag.name);
        this.createdAt = article.createdAt;
        this.updatedAt = article.updatedAt;
        this.author = new AuthorDto(article.author);
    }
}