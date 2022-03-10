import { NestFactory } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

import { MainOrderServiceRootModule } from './main-order-service.root.module';

async function bootstrap() {
  const app = await NestFactory.create(MainOrderServiceRootModule);
  const configProvider = app.get<ConfigService>(ConfigService);
  const port = configProvider.get<string>('server.port');

  const config = new DocumentBuilder()
    .setTitle('Order example')
    .setDescription('Order API description')
    .setVersion('1.0')
    .addTag('order')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('swagger', app, document);

  await app.listen(port);
}
bootstrap();
