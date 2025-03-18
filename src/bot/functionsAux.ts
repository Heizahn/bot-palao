import { SaveCupo } from '../db/saveCupo';
import { typeTurn } from '../entities/cupo';
import { errorUserInput } from '../error/errorUserInput';
import { Bot, ChatState } from '../interfaces/interfaces';
import { backButton, MainMenu, messages } from './menuMessage';
import { sendMessage } from './sendMessage';
import { stateManage } from './stateBot';

export async function handleMenuOption(
	client: Bot['client'],
	chatId: string,
	userInput: string,
) {
	const BUTTON_EXPIRATION_TIME = 60000;

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

		if (userInput === 'BACK_TO_MENU' || userInput === '0') {
			await handleMenuOption(client, chatId, 'SHOW_MENU');
			stateManage.setState(chatId, {
				currentState: 'MENU',
				lastMessage: messages.menu,
			});
			return;
		}

		// Verificar si los botones han expirado (para entradas numéricas)
		if (
			['1', '2', '3', '4', '5'].includes(userInput) &&
			stateManage.areButtonsExpired(chatId, BUTTON_EXPIRATION_TIME)
		) {
			// Mensaje de expiración
			const expirationMessage =
				'⏱️ Esta opción ha expirado. Aquí tienes un menú actualizado:';
			await sendMessage(client, chatId, expirationMessage);

			// Mostrar un nuevo menú
			await sendMessage(client, chatId, MainMenu(messages.menu));
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
			await sendMessage(client, chatId, selectedOption.message);

			if (selectedOption.state) {
				// Actualizamos el estado
				stateManage.setState(chatId, {
					currentState: selectedOption.state,
					lastMessage: selectedOption.message,
				});

				// Si no es una salida, mostramos el botón de retorno
				if (selectedOption.state !== null) {
					await sendMessage(client, chatId, backButton);
				}
			} else {
				stateManage.resetState(chatId);
			}
		} else {
			// Si la entrada no coincide con ninguna opción, mostramos el menú
			await sendMessage(client, chatId, MainMenu(messages.menu));
		}
	} catch (error) {
		console.error('Error en handleMenuOption:', error);
		await sendMessage(client, chatId, messages.invalid);
		await sendMessage(client, chatId, MainMenu(messages.menu));
	}
}

export async function handleCensusInput(
	client: Bot['client'],
	chatId: string,
	userInput: string,
) {
	const BUTTON_EXPIRATION_TIME = 60000;

	if (userInput === '0' || userInput === 'BACK_TO_MENU') {
		await handleMenuOption(client, chatId, 'SHOW_MENU');
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

		await sendMessage(client, chatId, formatMessage);
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
		await sendMessage(client, chatId, errors.error);
		return;
	}

	const errorMessages = Object.entries(errors)
		.filter(([key, value]) => key !== 'error' && value)
		.map(([_, value]) => value);

	if (errorMessages.length > 0) {
		const errorMessage = errorMessages.join('\n\n');
		await sendMessage(client, chatId, errorMessage);
		await sendMessage(client, chatId, backButton);
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

			await sendMessage(client, chatId, messages.success);
			await handleMenuOption(client, chatId, 'SHOW_MENU');
		} catch (error) {
			console.error('Error al guardar los datos del censo:', error);
			await sendMessage(client, chatId, 'Ocurrió un error al guardar los datos.');
		}
	}
}

export function handleMessageTime(botTime: number, smsTime: number): boolean {
	return smsTime < botTime;
}
