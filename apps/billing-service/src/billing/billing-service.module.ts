import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BillingEntity } from '@app/billing-service/entities/billing.entity';
import { ClientsModule } from '@nestjs/microservices';
import { ConfigService } from '@nestjs/config';
import { KAFKA_CONFIG_BILLING_SERVICE_TOKEN } from '@app/billing-service/constants/kafka';

import { BillingServiceController } from './billing-service.controller';
import { BillingServiceService } from './billing-service.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([BillingEntity]),
    ClientsModule.registerAsync([
      {
        name: KAFKA_CONFIG_BILLING_SERVICE_TOKEN,
        useFactory: (configService: ConfigService) =>
          configService.get<object>('kafka'),
        inject: [ConfigService],
      },
    ]),
  ],
  controllers: [BillingServiceController],
  providers: [BillingServiceService],
})
export class BillingServiceModule {}
