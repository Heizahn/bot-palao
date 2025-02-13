import { Message } from '@wppconnect-team/wppconnect';
import { Bot } from '../interfaces/interfaces';
import { stateManage } from './stateBot';
import { messages } from './menuMessage';
export default function bot({ client }: Bot) {
	console.log('bot started');

	client.onMessage(async (message: Message) => {
		if (message.isGroupMsg) return;

		if (!(message.type === 'chat')) return;

		const chatId = message.from;
		const state = stateManage.getState(chatId);
		const userInput = message.body?.trim();

		switch (state.currentState) {
			case 'INITIAL':
				await client.sendText(chatId, messages.welcome);
				stateManage.setState(chatId, { currentState: 'MENU' });
				break;

			case 'MENU':
				switch (userInput) {
					case '1':
						await client.sendText(chatId, messages.info);
						stateManage.setState(chatId, { currentState: 'INFO' });
						break;
					case '2':
						await client.sendText(chatId, messages.schedule);
						stateManage.setState(chatId, { currentState: 'SCHEDULE' });
						break;
					case '3':
						await client.sendText(chatId, messages.census);
						stateManage.setState(chatId, { currentState: 'CENSUS' });
						//TODO: Implementar la lógica para guardar los datos del censo
						break;
					case '4':
						await client.sendText(chatId, messages.payment);
						stateManage.setState(chatId, { currentState: 'PAYMENT' });
						break;
					case '5':
						await client.sendText(chatId, messages.goodbye);
						stateManage.resetState(chatId);
						break;
					default:
						await client.sendText(chatId, messages.invalid);
						await client.sendText(chatId, messages.welcome);
				}
				break;

			case 'INFO':
			case 'SCHEDULE':
			case 'CENSUS':
			case 'PAYMENT':
				if (userInput === '0') {
					await client.sendText(chatId, messages.welcome);
					stateManage.setState(chatId, { currentState: 'MENU' });
				} else {
					await client.sendText(chatId, messages.invalid);
				}
				break;
		}
	});
}
