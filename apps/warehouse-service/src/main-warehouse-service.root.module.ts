import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';

import { common, database, kafka } from './config';
import { WarehouseServiceModule } from '@app/warehouse-service/warehouse-service.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [database, common, kafka],
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) =>
        configService.get<object>('database'),
      inject: [ConfigService],
    }),
    WarehouseServiceModule,
  ],
  controllers: [],
  providers: [],
})
export class MainWarehouseServiceRootModule {}
