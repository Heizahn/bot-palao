import * as wppconnect from '@wppconnect-team/wppconnect';
import { botSession } from './config/config';
import bot from './bot/bot';
import { AppDataSource } from './db/db';
import 'reflect-metadata';

async function start() {
	const BOT_START_TIME = Date.now();
	try {
		const client = await wppconnect.create({
			session: botSession,
			puppeteerOptions: {
				args: ['--no-sandbox', '--disable-setuid-sandbox'],
			},
		});

		bot(client, BOT_START_TIME);
	} catch (error) {
		console.error(error);
	}
}

AppDataSource.initialize()
	.then(() => {
		start();
	})
	.catch((error) => {
		console.error('Error en la inicialización de la base de datos:', error);
	});
