import { NestFactory } from '@nestjs/core';
import { CoordinatorServiceModule } from './coordinator-service.module';

async function bootstrap() {
  const app = await NestFactory.create(CoordinatorServiceModule);
  await app.listen(3000);
}
bootstrap();
