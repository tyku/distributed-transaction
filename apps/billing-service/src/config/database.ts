import entities from '../entities';

export default () => ({
  database: {
    type: 'postgres',
    host: process.env.PG_HOST,
    port: +process.env.PG_PORT,
    username: process.env.PG_USER,
    password: process.env.PG_PASSWD,
    database: process.env.PG_DB,
    migrationsTableName: 'migrations',
    entities,
    migrationsRun: false,
  },
});
