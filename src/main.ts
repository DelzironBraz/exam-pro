import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { EnvService } from './shared/config/env';
import { AllExceptionsFilter } from './shared/filters/all-exceptions.filter';
import { LoggingInterceptor } from './shared/interceptors/logging.interceptor';
import { ResponseInterceptor } from './shared/interceptors/response.interceptor';
import { LoggerService } from './shared/infra/logger/logger.service';
import { LongRunningTaskRegistry } from './shared/infra/long-running-task.registry';

declare const module: any;

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { cors: true });

  const logger = app.get(LoggerService);
  const env = app.get(EnvService);

  app.useGlobalFilters(new AllExceptionsFilter(logger));
  app.useGlobalInterceptors(
    new LoggingInterceptor(logger),
    new ResponseInterceptor(),
  );
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
    }),
  );

  const config = new DocumentBuilder()
    .setTitle('Offensive World API')
    .setDescription('User management API')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  await app.listen(env.getPort());

  if (module.hot) {
    module.hot.accept();
    module.hot.dispose(() => {
      if (LongRunningTaskRegistry.isActive) {
        logger.warn(
          'Bootstrap',
          'HMR ignorado: sync JurisWay em andamento. Não salve arquivos até concluir.',
        );
        return;
      }
      void app.close();
    });
  }
}
void bootstrap();
