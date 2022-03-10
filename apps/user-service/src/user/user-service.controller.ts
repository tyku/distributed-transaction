import {
  Body,
  Controller,
  Get,
  Inject,
  OnModuleInit,
  Param,
  Post,
} from '@nestjs/common';
import { ClientKafka, EventPattern, Payload } from '@nestjs/microservices';
import { KAFKA_CONFIG_USER_SERVICE_TOKEN } from '@app/user-service/constants';

import { UserServiceService } from './user-service.service';

@Controller('v1/users')
export class UserServiceController {
  constructor(
    private readonly userServiceService: UserServiceService,
    @Inject(KAFKA_CONFIG_USER_SERVICE_TOKEN)
    private readonly client: ClientKafka,
  ) {}

  @Get(':id')
  retrieve(@Param('id') id: string) {
    return this.userServiceService.retrieve(id);
  }

  @Post()
  async create(@Body() data) {
    const result = await this.userServiceService.create(data);
    this.client.emit<string>('create.user.account', result);

    return result;
  }
}
