import { NestFactory } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { MainNotificationServiceRootModule } from './main-notification-service.root.module';

async function bootstrap() {
  const app = await NestFactory.create(MainNotificationServiceRootModule);
  const configProvider = app.get<ConfigService>(ConfigService);
  const port = configProvider.get<string>('server.port');
  const kafkaOptions = configProvider.get<object>('kafka');

  const config = new DocumentBuilder()
    .setTitle('Notification example')
    .setDescription('Notification API description')
    .setVersion('1.0')
    .addTag('notification')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('swagger', app, document);

  app.connectMicroservice(kafkaOptions);

  await app.startAllMicroservices();

  await app.listen(port);
}
bootstrap();
