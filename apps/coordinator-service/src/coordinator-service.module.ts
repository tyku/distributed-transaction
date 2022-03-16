import { Module } from '@nestjs/common';
import { CoordinatorServiceController } from './coordinator-service.controller';
import { CoordinatorServiceService } from './coordinator-service.service';
import { ClientsModule } from '@nestjs/microservices';
import { ConfigService } from '@nestjs/config';
import { KAFKA_CONFIG_CLIENT_SERVICE_TOKEN } from '@app/coordinator-service/constants';

@Module({
  imports: [
    ClientsModule.registerAsync([
      {
        name: KAFKA_CONFIG_CLIENT_SERVICE_TOKEN,
        useFactory: (configService: ConfigService) =>
          configService.get<object>('kafka'),
        inject: [ConfigService],
      },
    ]),
  ],
  controllers: [CoordinatorServiceController],
  providers: [CoordinatorServiceService],
})
export class CoordinatorServiceModule {}
