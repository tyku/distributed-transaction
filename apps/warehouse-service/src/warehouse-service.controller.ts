import { Controller } from '@nestjs/common';
import { WarehouseServiceService } from './warehouse-service.service';
import { MessagePattern } from '@nestjs/microservices';

@Controller()
export class WarehouseServiceController {
  constructor(
    private readonly warehouseServiceService: WarehouseServiceService,
  ) {}

  @MessagePattern('prepare.create.warehouse')
  prepare(message: Record<string, any>): Promise<Record<string, any>> {
    return this.warehouseServiceService.prepare(message.value);
  }

  @MessagePattern('commit.create.warehouse')
  commit(message: Record<string, any>): Promise<Record<string, any>> {
    return this.warehouseServiceService.commit(message.value);
  }

  @MessagePattern('rollback.create.warehouse')
  rollback(message: Record<string, any>): Promise<Record<string, any>> {
    return this.warehouseServiceService.rollback(message.value);
  }

  @MessagePattern('warehouse.retrieve.product')
  retrieve(message: Record<string, any>): Promise<any> {
    return this.warehouseServiceService.retrieve(message.value);
  }
}
