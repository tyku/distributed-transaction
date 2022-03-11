import { NestFactory } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { MainCoordinatorServiceRootModule } from '@app/coordinator-service/main-coordinator-service.root.module';

async function bootstrap() {
  const app = await NestFactory.create(MainCoordinatorServiceRootModule);
  const configProvider = app.get<ConfigService>(ConfigService);
  const port = configProvider.get<string>('server.port');
  const kafkaOptions = configProvider.get<object>('kafka');

  const config = new DocumentBuilder()
    .setTitle('Coordinator example')
    .setDescription('Coordinator API description')
    .setVersion('1.0')
    .addTag('Coordinator')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('swagger', app, document);

  app.connectMicroservice(kafkaOptions);

  await app.startAllMicroservices();

  await app.listen(port);
}
bootstrap();
