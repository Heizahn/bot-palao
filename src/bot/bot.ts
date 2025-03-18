import { Message, MessageType } from '@wppconnect-team/wppconnect';
import { Bot } from '../interfaces/interfaces';
import { stateManage } from './stateBot';
import { backButton, messages } from './menuMessage';
import { handleCensusInput, handleMenuOption, handleMessageTime } from './functionsAux';
import { sendMessage } from './sendMessage';

export default function bot(client: Bot['client'], botStartTime: number): void {
	console.log('bot started');

	client.onMessage(async (message: Message) => {
		try {
			// Validaciones iniciales
			if (
				message.isGroupMsg ||
				message.from === 'status@broadcast' ||
				handleMessageTime(botStartTime, message.timestamp * 1000)
			) {
				return;
			}

			const chatId = message.from;
			const state = stateManage.getState(chatId);

			let userInput: string;

			// Modificamos la extracción del input para manejar el botón de retorno
			if (message.type === 'list_response') {
				if (message.body?.includes('Volver al Menú')) {
					userInput = 'BACK_TO_MENU';
				} else {
					const match = message.body?.match(/^(\d+)️⃣/);
					userInput = match ? match[1] : '';
				}
			} else if (message.type === MessageType.CHAT) {
				userInput = message.body?.trim() || '';
				// Convertimos el '0' a BACK_TO_MENU para unificar la lógica de retorno
				if (userInput === '0') {
					userInput = 'BACK_TO_MENU';
				}
			} else {
				return;
			}

			// Manejamos los diferentes estados con la nueva lógica de botones
			switch (state.currentState) {
				case 'INITIAL':
					await handleMenuOption(client, chatId, 'SHOW_MENU');
					stateManage.setState(chatId, { currentState: 'MENU' });
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
					// Verificar si los botones han expirado
					const BUTTON_EXPIRATION_TIME = 60000;
					const buttonsExpired = stateManage.areButtonsExpired(
						chatId,
						BUTTON_EXPIRATION_TIME,
					);

					if (userInput === 'BACK_TO_MENU') {
						console.log('Volviendo al menú principal...');
						stateManage.setState(chatId, {
							currentState: 'MENU',
							lastMessage: messages.menu,
						});
						await handleMenuOption(client, chatId, 'SHOW_MENU');
					} else if (buttonsExpired) {
						// Si los botones han expirado, informamos al usuario
						await sendMessage(
							client,
							chatId,
							'⏱️ La sesión anterior ha expirado. Aquí tienes un menú actualizado:',
						);
						await handleMenuOption(client, chatId, 'SHOW_MENU');
					} else {
						// Si es una entrada inválida (pero los botones no han expirado)
						await sendMessage(client, chatId, messages.invalid);
						await sendMessage(client, chatId, backButton);
					}
			}
		} catch (error) {
			console.error('Error detallado en el bot:', error);
			try {
				await client.sendText(
					message.from,
					'Lo siento, ocurrió un error. Volvamos al menú principal...',
				);
				// Intentamos mostrar el menú principal después de un error
				await handleMenuOption(client, message.from, 'SHOW_MENU');
			} catch (menuError) {
				console.error('Error al mostrar menú después de error:', menuError);
			}
		}
	});
}
