import { Module } from '@nestjs/common';
import { CoordinatorServiceController } from './coordinator-service.controller';
import { CoordinatorServiceService } from './coordinator-service.service';

@Module({
  imports: [],
  controllers: [CoordinatorServiceController],
  providers: [CoordinatorServiceService],
})
export class CoordinatorServiceModule {}
