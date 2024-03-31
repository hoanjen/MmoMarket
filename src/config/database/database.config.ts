import * as dotenv from 'dotenv';
dotenv.config();
import { DataSource, DataSourceOptions } from 'typeorm';

const DatabaseConfig: DataSourceOptions = {
  type: 'mysql',
  host: process.env.MYSQL_HOST,
  port: +process.env.MYSQL_PORT || 3306,
  username: process.env.MYSQL_USERNAME,
  password: process.env.MYSQL_PASSWORD,
  database: process.env.MYSQL_DATABASE,
  entities: ['dist/**/*.entity.js'],
  synchronize: false,
  migrations: ['./**/generate/*.js'],
};

export default new DataSource(DatabaseConfig);
export const DatabaseConfigExport = DatabaseConfig;
