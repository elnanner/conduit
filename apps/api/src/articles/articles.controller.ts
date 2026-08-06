import { Body, Controller, Delete, Get, Param, Patch, Post, UseGuards } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { ArticlesService } from "./articles.service";
import { CreateArticleDto } from "./dto/create-article.dto";
import { UpdateArticleDto } from "./dto/update-article.dto";
import { CurrentUser } from "src/auth/current-user.decorator";

@Controller("articles")
export class ArticlesController {
    constructor(private readonly articlesService: ArticlesService) { }

    @Get()
    async findAll() {
        return await this.articlesService.findAll();
    }

    @Get(":slug")
    async findOne(@Param("slug") slug: string) {
        return await this.articlesService.findBySlug(slug);
    }

    @Post()
    @UseGuards(AuthGuard("jwt"))
    async create(@Body() dto: CreateArticleDto, @CurrentUser() user: { id: number }) {
        return await this.articlesService.create(dto, user.id);
    }

    @Patch(":slug")
    @UseGuards(AuthGuard("jwt"))
    async update(
        @Param("slug") slug: string,
        @Body() dto: UpdateArticleDto,
        @CurrentUser() user: { id: number },
    ) {
        return await this.articlesService.update(slug, dto, user.id);
    }

    @Delete(":slug")
    @UseGuards(AuthGuard("jwt"))
    async remove(@Param("slug") slug: string, @CurrentUser() user: { id: number }) {
        await this.articlesService.remove(slug, user.id);
        return { status: "ok" };
    }
}