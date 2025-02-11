import 'dotenv/config';

const botToken = process.env.BOT_TOKEN;
const botSession = process.env.BOT_SESSION;

if (!botToken) {
	throw new Error('BOT_TOKEN no esta definido');
}

if (!botSession) {
	throw new Error('BOT_SESSION no esta definido');
}

export { botToken, botSession };
