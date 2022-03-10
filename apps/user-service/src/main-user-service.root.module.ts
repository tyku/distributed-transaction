import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { UserServiceModule } from '@app/user-service/user/user-service.module';

import { common, database, kafka } from './config';

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
    UserServiceModule,
  ],
  controllers: [],
  providers: [],
})
export class MainUserServiceRootModule {}
