import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';

import { common, database, kafka } from './config';
import { CoordinatorServiceModule } from '@app/coordinator-service/coordinator-service.module';

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
    CoordinatorServiceModule,
  ],
  controllers: [],
  providers: [],
})
export class MainCoordinatorServiceRootModule {}
