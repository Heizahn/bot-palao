import * as wppconnect from '@wppconnect-team/wppconnect';
import { botSession } from './config/config';
import bot from './bot/bot';

async function main() {
	try {
		const client = await wppconnect.create({
			session: botSession,
		});

		bot({ client });
	} catch (error) {
		console.error(error);
	}
}

main();
