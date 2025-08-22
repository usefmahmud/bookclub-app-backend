import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const config = new DocumentBuilder()
    .setTitle('Bookclub API')
    .setDescription('The Bookclub application API documentation')
    .setVersion('1.0')
    .addBearerAuth({ type: 'http', scheme: 'bearer', bearerFormat: 'JWT' })
    .addCookieAuth('authentication')
    .addSecurityRequirements('bearer')
    .addSecurityRequirements('cookie')
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
}
bootstrap();
