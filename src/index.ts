import * as wppconnect from '@wppconnect-team/wppconnect';
import { botSession } from './config/config';
import bot from './bot/bot';

async function main() {
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

main();
