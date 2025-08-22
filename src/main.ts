import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import cookieParser from 'cookie-parser';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Enable cookie parser for httpOnly cookies
  app.use(cookieParser());

  // Enable global validation pipes
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
    }),
  );

  const config = new DocumentBuilder()
    .setTitle('Bookclub API')
    .setDescription('The Bookclub application API documentation')
    .setVersion('1.0')
    .addTag('bookclub')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);
  const swaggerCDN = 'https://cdn.jsdelivr.net/npm/swagger-ui-dist@5.11.0';

  SwaggerModule.setup('api', app, document, {
    customCssUrl: [`${swaggerCDN}/swagger-ui.css`],
    customJs: [
      `${swaggerCDN}/swagger-ui-bundle.js`,
      `${swaggerCDN}/swagger-ui-standalone-preset.js`,
    ],
    customSiteTitle: 'Bookclub API Documentation',
  });

  await app.listen(process.env.PORT ?? 3080);
  return app;
}

// For Vercel deployment
export default bootstrap;

// For local development
if (require.main === module) {
  bootstrap();
}
