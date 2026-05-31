import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { AuthModule } from './modules/auth/auth.module';
import { JwtAuthGuard } from './modules/auth/presentation/guards/jwt-auth.guard';
import { RolesGuard } from './modules/auth/presentation/guards/roles.guard';
import { EnvModule } from './modules/env/env.module';
import { GroupsModule } from './modules/groups/groups.module';
import { QuestionsModule } from './modules/questions/questions.module';
import { FlashcardsModule } from './modules/flashcards/flashcards.module';
import { ExamsModule } from './modules/exams/exams.module';
import { StudyPlansModule } from './modules/study-plans/study-plans.module';
import { SimulationsModule } from './modules/simulations/simulations.module';
import { TagsModule } from './modules/tags/tags.module';
import { AnalyticsModule } from './modules/analytics/analytics.module';
import { PdfParserModule } from './modules/pdf-parser/pdf-parser.module';
import { UsersModule } from './modules/users/users.module';
import { ExceptionsModule } from './shared/exceptions/exceptions.module';
import { LoggerModule } from './shared/infra/logger/logger.module';
import { PrismaModule } from './shared/database/prisma/prisma.module';
import { ScheduleModule } from '@nestjs/schedule';
import { ThrottlerModule } from '@nestjs/throttler';
import { HealthModule } from './shared/health/health.module';

@Module({
  imports: [
    HealthModule,
    EnvModule,
    PrismaModule,
    LoggerModule,
    ExceptionsModule,
    UsersModule,
    GroupsModule,
    QuestionsModule,
    TagsModule,
    SimulationsModule,
    FlashcardsModule,
    StudyPlansModule,
    ExamsModule,
    PdfParserModule,
    AnalyticsModule,
    AuthModule,
    ScheduleModule.forRoot(),
    ThrottlerModule.forRoot({
      throttlers: [
        {
          ttl: 60000,
          limit: 10,
        },
      ],
    }),
  ],
  providers: [
    { provide: APP_GUARD, useClass: JwtAuthGuard },
    { provide: APP_GUARD, useClass: RolesGuard },
  ],
})
export class AppModule {}
