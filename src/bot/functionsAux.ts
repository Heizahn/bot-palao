import { SaveCupo } from '../db/saveCupo';
import { typeTurn } from '../entities/cupo';
import { errorUserInput } from '../error/errorUserInput';
import { Bot, ChatState } from '../interfaces/interfaces';
import { backButton, MainMenu, messages } from './menuMessage';
import { stateManage } from './stateBot';

export async function handleMenuOption(
	client: Bot['client'],
	chatId: string,
	userInput: string,
) {
	// Definimos las opciones del menú con sus mensajes y estados
	const menuOption: Record<
		string,
		{ message: string; state: ChatState['currentState'] | null }
	> = {
		'1': { message: messages.info.text, state: 'INFO' },
		'2': { message: messages.schedule.text, state: 'SCHEDULE' },
		'3': { message: messages.census.text, state: 'CENSUS' },
		'4': { message: messages.payment.text, state: 'PAYMENT' },
		'5': { message: messages.goodbye, state: null },
	};

	try {
		if (stateManage.getState(chatId).currentState === 'INITIAL') {
			await client.sendListMessage(chatId, MainMenu(messages.welcome));
			stateManage.setState(chatId, {
				currentState: 'MENU',
				lastMessage: messages.welcome,
			});
			return;
		}

		if (userInput === 'BACK_TO_MENU') {
			await handleMenuOption(client, chatId, 'SHOW_MENU');
			stateManage.setState(chatId, {
				currentState: 'MENU',
				lastMessage: messages.menu,
			});
			return;
		}

		// Procesamiento de la selección del usuario
		const selectedOption = menuOption[userInput];

		if (selectedOption) {
			// Enviamos el mensaje de la sección
			await client.sendText(chatId, selectedOption.message);

			if (selectedOption.state) {
				// Actualizamos el estado
				stateManage.setState(chatId, {
					currentState: selectedOption.state,
					lastMessage: selectedOption.message,
				});

				// Si no es una salida, mostramos el botón de retorno
				if (selectedOption.state !== null) {
					await client.sendListMessage(chatId, backButton);
				}
			} else {
				stateManage.resetState(chatId);
			}
		} else {
			await client.sendListMessage(chatId, MainMenu(messages.menu));
		}
	} catch (error) {
		console.error('Error en handleMenuOption:', error);
		await client.sendText(chatId, messages.invalid);
		await client.sendListMessage(chatId, MainMenu(messages.menu));
	}
}

export async function handleCensusInput(
	client: Bot['client'],
	chatId: string,
	userInput: string,
) {
	if (userInput === '0' || userInput === 'BACK_TO_MENU') {
		await handleMenuOption(client, chatId, 'SHOW_MENU');
		stateManage.setState(chatId, {
			currentState: 'MENU',
			lastMessage: messages.welcome,
		});
		return;
	}
	if (!userInput.includes('\n')) {
		const formatMessage =
			'📝 Por favor, ingresa tus datos exactamente en este formato:\n\n' +
			'1. Nombre y Apellido del Representante\n' +
			'2. Número de teléfono (11 dígitos)\n' +
			'3. Nombre y Apellido del Alumno\n' +
			'4. Fecha de Nacimiento (DD/MM/AAAA)\n' +
			'5. Horario (escribe una letra):\n' +
			'Descubrimiento = Horario 1 (07:00 AM - 11:30 AM)\n' +
			'Crecimiento = Horario 2 (07:00 AM - 03:00 PM)\n' +
			'Diversion = Horario 3 (07:00 AM - 05:00 PM)\n\n' +
			'📌 Ejemplo:\n' +
			'Juan Perez\n' +
			'04240000000\n' +
			'Juanito Perez\n' +
			'15/06/2010\n' +
			'Descubrimiento';

		await client.sendText(chatId, formatMessage);

		stateManage.setState(chatId, {
			...stateManage.getState(chatId),
			lastMessage: formatMessage,
		});

		return;
	}

	const dataArr = userInput.split('\n');

	const data = {
		representante: dataArr[0]?.trimEnd() || undefined,
		tlf: dataArr[1] || undefined,
		alumno: dataArr[2]?.trimEnd() || undefined,
		fecha_nacimiento: dataArr[3] || undefined,
		horario: dataArr[4] || undefined,
	};

	const errors = errorUserInput(data);

	if (errors.error) {
		await client.sendText(chatId, errors.error);
		stateManage.setState(chatId, {
			...stateManage.getState(chatId),
			lastMessage: errors.error,
		});
		return;
	}

	const errorMessages = Object.entries(errors)
		.filter(([key, value]) => key !== 'error' && value)
		.map(([_, value]) => value);

	if (errorMessages.length > 0) {
		const errorMessage = errorMessages.join('\n\n');
		await client.sendText(chatId, errorMessage);
		await client.sendListMessage(chatId, backButton);
		stateManage.setState(chatId, {
			...stateManage.getState(chatId),
			lastMessage: errorMessage,
		});
	} else {
		try {
			const horario = data.horario?.toLowerCase();
			await SaveCupo({
				representante: data.representante as string,
				tlf: data.tlf as string,
				tlf_registro: chatId.replace('@c.us', ''),
				alumno: data.alumno as string,
				fecha_nacimiento: data.fecha_nacimiento as string,
				horario:
					horario === 'descubrimiento'
						? typeTurn.DESCUBRIMIENTO
						: horario === 'crecimiento'
						? typeTurn.CRECIMIENTO
						: typeTurn.DIVERSION,
			});

			await client.sendText(chatId, messages.success);
			await handleMenuOption(client, chatId, 'SHOW_MENU');
			stateManage.setState(chatId, {
				currentState: 'MENU',
				lastMessage: messages.success,
			});
		} catch (error) {
			console.error('Error al guardar los datos del censo:', error);
			await client.sendText(chatId, 'Ocurrió un error al guardar los datos.');
		}
	}
}

export function handleMessageTime(botTime: number, smsTime: number): boolean {
	return smsTime < botTime;
}
