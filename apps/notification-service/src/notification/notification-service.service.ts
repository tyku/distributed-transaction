import { Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { NotificationEntity } from '../entities/notification.entity';

@Injectable()
export class NotificationServiceService {
  constructor(
    @InjectRepository(NotificationEntity)
    private readonly notificationRepo: Repository<NotificationEntity>,
  ) {}

  async create(data: Record<string, any>) {
    const { email, phone = '', user_id, message, type } = data;

    const result = await this.notificationRepo
      .createQueryBuilder()
      .insert()
      .into('notifications')
      .values({
        type,
        email,
        phone,
        user_id,
        message,
      })
      .returning('id, user_id, type, email, message')
      .execute();

    const { raw = [] } = result;
    const [response] = raw;

    return response;
  }

  list() {
    return this.notificationRepo.createQueryBuilder().select(['*']).execute();
  }

  async retrieve(user_id) {
    const result = await this.notificationRepo
      .createQueryBuilder()
      .select(['*'])
      .where(`user_id::integer=${user_id}`)
      .orderBy('id', 'DESC')
      .limit(1)
      .execute();

    const [response = {}] = result;

    return response;
  }
}
