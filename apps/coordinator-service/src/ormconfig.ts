import { ConnectionOptions } from 'typeorm';

const config: ConnectionOptions = {
  type: 'postgres',
  host: process.env.PG_HOST,
  port: +process.env.PG_PORT,
  username: process.env.PG_USER,
  password: process.env.PG_PASSWD,
  database: process.env.PG_DB,
  migrationsTableName: 'migrations',
  entities: [__dirname + '/entities/*.entity.ts'],
  migrations: [__dirname + '/migrations/*.ts'],
  migrationsRun: false,
  cli: {
    migrationsDir: __dirname + '/migrations',
  },
};

export default config;