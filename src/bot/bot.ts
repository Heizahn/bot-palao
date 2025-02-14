import { Message } from '@wppconnect-team/wppconnect';
import { Bot } from '../interfaces/interfaces';
import { stateManage } from './stateBot';
import { messages } from './menuMessage';
import { errorUserInput } from '../error/errorUserInput';
import { handleCensusInput, handleMenuOption } from './functionsAux';

export default function bot(client: Bot['client']): void {
	console.log('bot started');

	client.onMessage(async (message: Message) => {
		try {
			if (
				message.isGroupMsg ||
				!(message.type === 'chat') ||
				message.from === 'status@broadcast'
			) {
				return;
			}

			const chatId = message.from;
			const state = stateManage.getState(chatId);
			const userInput = message.body?.trim() || '';

			switch (state.currentState) {
				case 'INITIAL':
					await client.sendText(chatId, messages.welcome);
					stateManage.setState(chatId, {
						currentState: 'MENU',
						lastMessage: messages.welcome,
					});
					break;

				case 'MENU':
					await handleMenuOption(client, chatId, userInput);
					break;

				case 'CENSUS':
					await handleCensusInput(client, chatId, userInput);
					break;

				case 'INFO':
				case 'SCHEDULE':
				case 'PAYMENT':
					if (userInput === '0') {
						await client.sendText(chatId, messages.welcome);
						stateManage.setState(chatId, {
							currentState: 'MENU',
							lastMessage: messages.welcome,
						});
					} else {
						await client.sendText(chatId, messages.invalid);
					}
					break;
			}
		} catch (error) {
			console.error('Error en el bot', error);
			await client.sendText(
				message.from,
				'Ocurrió un error. Por favor, intenta de nuevo.',
			);
		}
	});
}
