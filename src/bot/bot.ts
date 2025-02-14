import { Message, MessageType } from '@wppconnect-team/wppconnect';
import { Bot } from '../interfaces/interfaces';
import { stateManage } from './stateBot';
import { messages } from './menuMessage';
import { handleCensusInput, handleMenuOption, handleMessageTime } from './functionsAux';

export default function bot(client: Bot['client'], botStartTime: number): void {
	console.log('bot started');

	client.onMessage(async (message: Message) => {
		try {
			// Validaciones iniciales permanecen igual
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
					// Simplificamos el manejo de retorno al menú
					if (userInput === 'BACK_TO_MENU') {
						console.log('Volviendo al menú principal...');
						stateManage.setState(chatId, {
							currentState: 'MENU',
							lastMessage: 'menu',
						});
						await handleMenuOption(client, chatId, 'SHOW_MENU');
					} else {
						await client.sendText(chatId, messages.invalid);
						// Mostramos el botón de retorno después del mensaje de error
						const backButton = {
							buttonText: '🔙 Volver al Menú',
							description: 'Selecciona para regresar al menú principal',
							sections: [
								{
									title: 'Navegación',
									rows: [
										{
											rowId: 'BACK_TO_MENU',
											title: '🔙 Volver al Menú Principal',
											description: 'Regresar al menú de opciones',
										},
									],
								},
							],
						};
						await client.sendListMessage(chatId, backButton);
					}
					break;
			}
		} catch (error) {
			console.error('Error detallado en el bot:', error);
			// Mejoramos el mensaje de error y proporcionamos una forma de volver al menú
			await client.sendText(
				message.from,
				'Lo siento, ocurrió un error. Volvamos al menú principal...',
			);
			// Intentamos mostrar el menú principal después de un error
			try {
				await handleMenuOption(client, message.from, 'SHOW_MENU');
				stateManage.setState(message.from, { currentState: 'MENU' });
			} catch (menuError) {
				console.error('Error al mostrar menú después de error:', menuError);
			}
		}
	});
}
