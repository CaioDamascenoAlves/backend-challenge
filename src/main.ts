import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger } from '@nestjs/common';
import { sweggerConfig } from 'swegger.config';
import { SwaggerModule } from '@nestjs/swagger';
import { ExpressAdapter } from '@nestjs/platform-express';
import * as bodyParser from 'body-parser';

async function bootstrap() {
  const logger = new Logger();

  const app = await NestFactory.create(AppModule, new ExpressAdapter(), {
    cors: true,
  });

  app.use(bodyParser.urlencoded({ extended: true }));
  app.use(bodyParser.json());
  const document = SwaggerModule.createDocument(app, sweggerConfig);
  SwaggerModule.setup('api', app, document);

  const port = process.env.PORT;
  await app.listen(port);

  logger.log(`Application listening on port ${port}`);
}
bootstrap();
