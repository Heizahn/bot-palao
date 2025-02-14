import { errorUserInput } from '../error/errorUserInput';
import { Bot, ChatState } from '../interfaces/interfaces';
import { messages } from './menuMessage';
import { stateManage } from './stateBot';

export async function handleMenuOption(
	client: Bot['client'],
	chatId: string,
	userInput: string,
) {
	const menuOption: Record<
		string,
		{ message: string; state: ChatState['currentState'] | null }
	> = {
		'1': { message: messages.info, state: 'INFO' },
		'2': { message: messages.schedule, state: 'SCHEDULE' },
		'3': { message: messages.census, state: 'CENSUS' },
		'4': { message: messages.payment, state: 'PAYMENT' },
		'5': { message: messages.goodbye, state: null },
	};

	const selectedOption = menuOption[userInput];

	if (selectedOption) {
		await client.sendText(chatId, selectedOption.message);

		if (selectedOption.state) {
			stateManage.setState(chatId, {
				currentState: selectedOption.state,
				lastMessage: selectedOption.message,
			});
		} else {
			stateManage.resetState(chatId);
		}
	} else {
		await client.sendText(chatId, messages.invalid);
		await client.sendText(chatId, messages.welcome);
	}
}

export async function handleCensusInput(
	client: Bot['client'],
	chatId: string,
	userInput: string,
) {
	if (userInput === '0') {
		await client.sendText(chatId, messages.welcome);
		stateManage.setState(chatId, { currentState: 'MENU', lastMessage: messages.welcome });
		return;
	}

	if (!userInput.includes('\n')) {
		const formatMessage =
			'Por favor, ingresa los datos en el siguiente formato:\n\nNombre Apellido\n04241234567\nNombre Alumno\nDD-MM-AAAA\nA';

		await client.sendText(chatId, formatMessage);

		stateManage.setState(chatId, {
			...stateManage.getState(chatId),
			lastMessage: formatMessage,
		});

		return;
	}

	const dataArr = userInput.split('\n');
	const data = {
		representante: dataArr[0] || undefined,
		tlf: dataArr[1] || undefined,
		alumno: dataArr[2] || undefined,
		fecha_nacimiento: dataArr[3],
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
		stateManage.setState(chatId, {
			...stateManage.getState(chatId),
			lastMessage: errorMessage,
		});
	} else {
		await client.sendText(chatId, messages.success);
		stateManage.setState(chatId, {
			currentState: 'MENU',
			lastMessage: messages.success,
		});
		await client.sendText(chatId, messages.welcome);
	}
}
