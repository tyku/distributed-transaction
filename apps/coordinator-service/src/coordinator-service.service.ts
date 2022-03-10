import { Injectable } from '@nestjs/common';

@Injectable()
export class CoordinatorServiceService {
  getHello(): string {
    return 'Hello World!';
  }
}
