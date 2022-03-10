import { NestFactory } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import { MainUserServiceRootModule } from '@app/user-service/main-user-service.root.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(MainUserServiceRootModule);
  const configProvider = app.get<ConfigService>(ConfigService);

  const port = configProvider.get<string>('server.port');
  const kafkaOptions = configProvider.get<object>('kafka');

  const config = new DocumentBuilder()
    .setTitle('User example')
    .setDescription('User API description')
    .setVersion('1.0')
    .addTag('user')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('swagger', app, document);

  app.connectMicroservice(kafkaOptions);

  await app.startAllMicroservices();

  await app.listen(port);
}
bootstrap();
