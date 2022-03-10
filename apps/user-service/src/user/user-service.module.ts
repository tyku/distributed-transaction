import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config';
import { ClientsModule} from '@nestjs/microservices';
import { KAFKA_CONFIG_USER_SERVICE_TOKEN } from '@app/user-service/constants';
import { UserEntity } from '@app/user-service/entities/user.entity';

import { UserServiceController } from './user-service.controller';
import { UserServiceService } from './user-service.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([UserEntity]),
    ClientsModule.registerAsync([
      {
        name: KAFKA_CONFIG_USER_SERVICE_TOKEN,
        useFactory: (configService: ConfigService) =>
          configService.get<object>('kafka'),
        inject: [ConfigService],
      },
    ]),
  ],
  controllers: [UserServiceController],
  providers: [UserServiceService],
})
export class UserServiceModule {}
