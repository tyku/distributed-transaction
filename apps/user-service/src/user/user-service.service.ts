import { Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from '@app/user-service/entities/user.entity';

@Injectable()
export class UserServiceService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepo: Repository<UserEntity>,
  ) {}

  async create(data: Record<string, any>) {
    const { username, firstname, age, email } = data;

    const result = await this.userRepo
      .createQueryBuilder()
      .insert()
      .values({
        age,
        email,
        username,
        firstname,
      })
      .returning('id, username, firstname, email, age')
      .execute();

    const { raw = [] } = result;
    const [response] = raw;

    return response;
  }

  async retrieve(id) {
    const user = await this.userRepo
      .createQueryBuilder()
      .select(['*'])
      .where(`id=${id}`)
      .execute();

    return user;
  }
}
