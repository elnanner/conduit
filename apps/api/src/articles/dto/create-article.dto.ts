import { IsArray, IsOptional, IsString, MinLength } from "class-validator";

export class CreateArticleDto {
    @IsString()
    @MinLength(1)
    title!: string;

    @IsString()
    @MinLength(1)
    description!: string;

    @IsString()
    @MinLength(1)
    body!: string;

    @IsOptional()
    @IsArray()
    @IsString({ each: true })
    tagList?: string[];
}
