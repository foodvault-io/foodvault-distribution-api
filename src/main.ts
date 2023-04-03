import { NestFactory, HttpAdapterHost, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger, ValidationPipe, VersioningType } from '@nestjs/common';
import { PrismaClientExceptionFilter } from './prisma-client-exception/prisma-client-exception.filter';
import {
  SwaggerModule,
  DocumentBuilder,
  SwaggerDocumentOptions,
} from '@nestjs/swagger';
import { AtJwtGuard } from './common/guards';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Make every Route start with /api
  app.setGlobalPrefix('api');

  // Set version of the API
  app.enableVersioning({
    type: VersioningType.URI,
  })

  // Enable CORS
  app.enableCors({
    // setup allowed urls to call api
    origin: ['http://192.168.1.125:19000']
  });

  // Enable Global validation
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }));

  // Enable global authentication
  const reflector = app.get(Reflector);
  app.useGlobalGuards(new AtJwtGuard(reflector));

  // Enable global exception filter
  const { httpAdapter } = app.get(HttpAdapterHost);
  app.useGlobalFilters(new PrismaClientExceptionFilter(httpAdapter));

  // Initialize Swagger
  const config = new DocumentBuilder()
    .setTitle('FoodVault API')
    .setDescription('FoodVault API description')
    .setVersion('1.0.0')
    .addServer('http://localhost:3000', 'Development server')
    .build();

  const options: SwaggerDocumentOptions = {
    operationIdFactory: (
      controllerKey: string,
      methodKey: string,
    ) => methodKey
  };

  const document = SwaggerModule.createDocument(app, config, options);
  SwaggerModule.setup('swagger', app, document);
  

  // Start the server
  await app.listen(process.env.PORT || 3000);
  const logger = new Logger('Bootstrap');
  logger.log(`FoodVault is running on: ${await app.getUrl()}`)
}
bootstrap();
