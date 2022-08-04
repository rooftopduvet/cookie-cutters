import 'reflect-metadata';
import { DataSource } from 'typeorm';
import * as entities from './entities';

export const dbEnv = {
  database: process.env.POSTGRES_DB || 'postgres',
  username: process.env.POSTGRES_USER || 'postgres',
  password: process.env.POSTGRES_PASSWORD || 'postgres',
};

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: 'db',
  port: 5432,
  ...dbEnv,
  logging: false,
  entities,
  migrations: [
    `${__dirname}/migrations/*.js`,
    `${__dirname}/migrations/*.ts`,
  ],
  migrationsTableName: 'migrations',
});
