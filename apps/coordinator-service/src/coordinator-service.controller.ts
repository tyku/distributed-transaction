import { Controller, Get } from '@nestjs/common';
import { CoordinatorServiceService } from './coordinator-service.service';

@Controller()
export class CoordinatorServiceController {
  constructor(private readonly coordinatorServiceService: CoordinatorServiceService) {}

  @Get()
  getHello(): string {
    return this.coordinatorServiceService.getHello();
  }
}
