import { NestFactory } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import { MainBillingServiceRootModule } from '@app/billing-service/main-billing-service.root.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(MainBillingServiceRootModule);
  const configProvider = app.get<ConfigService>(ConfigService);
  const port = configProvider.get<string>('server.port');
  const kafkaOptions = configProvider.get<object>('kafka');

  const config = new DocumentBuilder()
    .setTitle('Billing example')
    .setDescription('Billing API description')
    .setVersion('1.0')
    .addTag('billing')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('swagger', app, document);

  app.connectMicroservice(kafkaOptions);

  await app.startAllMicroservices();

  await app.listen(port);
}
bootstrap();
