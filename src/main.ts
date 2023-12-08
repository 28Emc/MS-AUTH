import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { ValidationPipe } from '@nestjs/common';
import { NestExpressApplication } from '@nestjs/platform-express';
import { DocumentBuilder, SwaggerCustomOptions, SwaggerDocumentOptions, SwaggerModule } from '@nestjs/swagger';
import { ApiKeyGuard } from './guards/api-key.guard';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    rawBody: true
  });

  const configService = app.get(ConfigService);

  const hostDomain = process.env.NODE_ENV === 'local' ? `${configService.get<string>('BASE_URL')}:${configService.get<string>('PORT')}` : `${configService.get<string>('BASE_URL')}`;
  const globalPrefix = `${configService.get<string>('VERSION')}/api`;
  const swConfig = new DocumentBuilder()
    .setTitle('Ms Auth')
    .setDescription('Microservicio que gestiona el inicio de sesión de forma general.')
    .setVersion('1.0')
    .addServer(`${hostDomain}/${globalPrefix}`)
    .addBearerAuth()
    .build();
  const swOptions: SwaggerDocumentOptions = {
    // operationIdFactory: (controllerKey: string, methodKey: string) => methodKey,
  };
  const swCustomOptions: SwaggerCustomOptions = {
    customSiteTitle: 'Ms Auth - API Docs',
    swaggerOptions: {
      showRequestDuration: true,
    },
  };
  const document = SwaggerModule.createDocument(app, swConfig, swOptions);
  SwaggerModule.setup(`${globalPrefix}/docs`, app, document, swCustomOptions);

  app.useGlobalPipes(new ValidationPipe({
    transformOptions: {
      enableImplicitConversion: true,
    }
  }));

  const reflector = app.get(Reflector);
  app.useGlobalGuards(new ApiKeyGuard(reflector));

  app.setGlobalPrefix(globalPrefix);

  app.useBodyParser('json', { limit: '1mb' });

  app.enableCors();

  await app.listen(configService.get<string>('PORT'));
  console.log(`MS-AUTH listening on port ${configService.get<string>('PORT')}`);
}
bootstrap();
