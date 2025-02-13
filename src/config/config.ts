import 'dotenv/config';

const botSession = process.env.BOT_SESSION;

if (!botSession) {
	throw new Error('BOT_SESSION no esta definido');
}

export { botSession };
