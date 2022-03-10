import { registerAs } from '@nestjs/config';
import { KafkaOptions, Transport } from '@nestjs/microservices';

export default registerAs(
  'kafka',
  (): KafkaOptions => ({
    transport: Transport.KAFKA,

    options: {
      client: {
        brokers: [process.env.KAFKA_BROKER],
      },
      consumer: {
        groupId: '1',
        allowAutoTopicCreation: true,
      },
    },
  }),
);
