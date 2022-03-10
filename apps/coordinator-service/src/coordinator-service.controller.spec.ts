import { Test, TestingModule } from '@nestjs/testing';
import { CoordinatorServiceController } from './coordinator-service.controller';
import { CoordinatorServiceService } from './coordinator-service.service';

describe('CoordinatorServiceController', () => {
  let coordinatorServiceController: CoordinatorServiceController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [CoordinatorServiceController],
      providers: [CoordinatorServiceService],
    }).compile();

    coordinatorServiceController = app.get<CoordinatorServiceController>(CoordinatorServiceController);
  });

  describe('root', () => {
    it('should return "Hello World!"', () => {
      expect(coordinatorServiceController.getHello()).toBe('Hello World!');
    });
  });
});
