import { KafkaOptions, Transport } from '@nestjs/microservices';
import { registerAs } from '@nestjs/config';

export default registerAs(
  'kafka',
  (): KafkaOptions => ({
    transport: Transport.KAFKA,

    options: {
      client: {
        clientId: 'coordinator-service',
        brokers: [process.env.KAFKA_BROKER],
      },
      consumer: {
        groupId: 'coordinator-service-consumer',
        allowAutoTopicCreation: true,
      },
    },
  }),
);
