import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { PrismaModule } from './prisma/prisma.module';
import { ArticlesService } from './articles/articles.service';
import { ArticlesModule } from './articles/articles.module';
import { UsersModule } from './users/users.module';

@Module({
  imports: [AuthModule, PrismaModule, ArticlesModule, UsersModule],
  controllers: [AppController],
  providers: [AppService, ArticlesService],
})
export class AppModule {}