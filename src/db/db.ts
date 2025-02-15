import { DataSource } from 'typeorm';
import { MysqlConnectionOptions } from 'typeorm/driver/mysql/MysqlConnectionOptions';
import { Cupo } from '../entities/cupo';

if (!process.env.DB_TYPE) {
	throw new Error('DB_TYPE is not defined');
}

if (!process.env.DB_HOST) {
	throw new Error('DB_HOST is not defined');
}

if (!process.env.DB_PORT) {
	throw new Error('DB_PORT is not defined');
}

if (!process.env.DB_USER) {
	throw new Error('DB_USER is not defined');
}

if (!process.env.DB_PASS) {
	throw new Error('DB_PASS is not defined');
}

if (!process.env.DB_NAME) {
	throw new Error('DB_NAME is not defined');
}

export const AppDataSource = new DataSource({
	type: process.env.DB_TYPE as MysqlConnectionOptions['type'],
	host: process.env.DB_HOST,
	port: Number(process.env.DB_PORT),
	username: process.env.DB_USER,
	password: process.env.DB_PASS,
	database: process.env.DB_NAME,
	synchronize: true,
	entities: [Cupo],
});
