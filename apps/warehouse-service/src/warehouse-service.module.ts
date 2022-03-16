import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { WarehouseEntity } from '@app/warehouse-service/entities/warehouse.entity';

import { WarehouseServiceController } from './warehouse-service.controller';
import { WarehouseServiceService } from './warehouse-service.service';

@Module({
  imports: [TypeOrmModule.forFeature([WarehouseEntity])],
  controllers: [WarehouseServiceController],
  providers: [WarehouseServiceService],
})
export class WarehouseServiceModule {}
