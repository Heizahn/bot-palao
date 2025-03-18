import { Bot } from '../interfaces/interfaces';
import { stateManage } from './stateBot';
export async function sendMessage(
	client: Bot['client'],
	chatId: string,
	message: string | any,
): Promise<void> {
	try {
		if (typeof message === 'string') {
			await client.sendText(chatId, message);
		} else {
			const adaptedMessage = {
				...message,
				sections: message.sections.map((section: any) => ({
					title: section.title,
					rows: section.rows.map((row: any) => ({
						rowId: row.rowId,
						title: row.title,
						description: row.description || '', // Valor por defecto
					})),
				})),
			};

			await client.sendListMessage(chatId, adaptedMessage as any);
		}

		const currentState = stateManage.getState(chatId);
		stateManage.setState(chatId, {
			...currentState,
			lastMessageTime: Date.now(),
		});
	} catch (error) {
		console.error('Error en sendMessage:', error);
		try {
			await client.sendText(
				chatId,
				'Ocurrió un error al procesar tu solicitud. Por favor, intenta nuevamente.',
			);
		} catch (retryError) {
			console.error('Error al enviar mensaje de error:', retryError);
		}
	}
}
