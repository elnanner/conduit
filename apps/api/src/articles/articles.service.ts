import { ForbiddenException, Injectable, NotFoundException } from "@nestjs/common";
import { randomBytes } from "crypto";
import slugify from "slugify";
import { PrismaService } from "src/prisma/prisma.service";
import { CreateArticleDto } from "./dto/create-article.dto";
import { UpdateArticleDto } from "./dto/update-article.dto";
import { ArticleResponseDto } from "./dto/article-response.dto";

const ARTICLE_INCLUDE = { author: true, tags: true };

@Injectable()
export class ArticlesService {
    constructor(private readonly prismaService: PrismaService) { }

    async create(dto: CreateArticleDto, authorId: number) {
        const slug = this.generateSlug(dto.title);

        const article = await this.prismaService.article.create({
            data: {
                slug,
                title: dto.title,
                description: dto.description,
                body: dto.body,
                authorId: authorId,
                tags: {
                    connectOrCreate: (dto.tagList ?? []).map((name) => ({
                        where: { name },
                        create: { name },
                    })),
                },
            },
            include: ARTICLE_INCLUDE,
        });

        return new ArticleResponseDto(article);
    }

    async findAll() {
        const articles = await this.prismaService.article.findMany({
            include: ARTICLE_INCLUDE,
            orderBy: { createdAt: "desc" },
        });

        return articles.map((article) => new ArticleResponseDto(article));
    }

    async findBySlug(slug: string) {
        const article = await this.prismaService.article.findUnique({
            where: { slug },
            include: ARTICLE_INCLUDE,
        });

        if (!article) {
            throw new NotFoundException("Article not found");
        }

        return new ArticleResponseDto(article);
    }

    async update(slug: string, dto: UpdateArticleDto, currentUserId: number) {
        const existing = await this.findArticleOrThrow(slug);
        this.assertIsOwner(existing.authorId, currentUserId);

        const article = await this.prismaService.article.update({
            where: { slug },
            data: {
                title: dto.title,
                description: dto.description,
                body: dto.body,
                ...(dto.tagList && {
                    tags: {
                        set: [],
                        connectOrCreate: dto.tagList.map((name) => ({
                            where: { name },
                            create: { name },
                        })),
                    },
                }),
            },
            include: ARTICLE_INCLUDE,
        });

        return new ArticleResponseDto(article);
    }

    async remove(slug: string, currentUserId: number) {
        const existing = await this.findArticleOrThrow(slug);
        this.assertIsOwner(existing.authorId, currentUserId);

        await this.prismaService.article.delete({ where: { slug } });
    }

    private async findArticleOrThrow(slug: string) {
        const article = await this.prismaService.article.findUnique({ where: { slug } });

        if (!article) {
            throw new NotFoundException("Article not found");
        }

        return article;
    }

    private assertIsOwner(authorId: number, currentUserId: number) {
        if (authorId !== currentUserId) {
            throw new ForbiddenException("You are not the author of this article");
        }
    }

    private generateSlug(title: string): string {
        const base = slugify(title, { lower: true, strict: true });
        const suffix = randomBytes(3).toString("hex");
        return `${base}-${suffix}`;
    }
}