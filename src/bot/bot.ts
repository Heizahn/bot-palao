import { Message } from '@wppconnect-team/wppconnect';
import { Bot } from '../interfaces/interfaces';
import { stateManage } from './stateBot';
import { messages } from './menuMessage';

export default function bot(client: Bot['client']): void {
	console.log('bot started');

	client.onMessage(async (message: Message) => {
		if (message.isGroupMsg) return;

		if (!(message.type === 'chat')) return;

		const chatId = message.from;

		if (chatId === 'status@broadcast') return;

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
			case 'PAYMENT':
				if (userInput === '0') {
					await client.sendText(chatId, messages.welcome);
					stateManage.setState(chatId, { currentState: 'MENU' });
				} else {
					await client.sendText(chatId, messages.invalid);
				}
				break;

			case 'CENSUS':
				if (userInput === '0') {
					await client.sendText(chatId, messages.welcome);
					stateManage.setState(chatId, { currentState: 'MENU' });
				} else {
					console.log('Guardando datos del censo...');

					const dataArr = userInput?.split('\n');
					let data = {
						representante: dataArr?.[0],
						tlf: dataArr?.[1],
						alumno: dataArr?.[2],
						fechaNacimiento: dataArr?.[3]
							? dataArr[3].replace(/\//g, '-')
							: undefined,
						horario: dataArr?.[4],
					};

					if (Object.values(data).some((value) => value === undefined)) {
						await client.sendText(chatId, 'Por favor, completa todos los campos.');
					} else {
						if (data.representante && data.representante.split(' ').length < 2) {
							await client.sendText(
								chatId,
								'Por favor, ingresa un nombre y un apellido.\nJuan Pérez',
							);
							return;
						}

						if (data.tlf && data.tlf.length !== 11) {
							await client.sendText(
								chatId,
								'Por favor, ingresa un número de teléfono válido.\n04141234567',
							);
							return;
						}

						if (data.fechaNacimiento && data.fechaNacimiento.length !== 10) {
							await client.sendText(
								chatId,
								'Por favor, ingresa una fecha de nacimiento válida.\nDD/MM/AAAA',
							);
							return;
						}

						if (
							data.horario &&
							!['a', 'b', 'c'].includes(data.horario.toLowerCase())
						) {
							await client.sendText(
								chatId,
								'Por favor, ingresa un horario válido.\nMañana Opción A\nMediano Opción B\nCompleto Opción C',
							);
							return;
						}

						await client.sendText(chatId, 'Datos guardados correctamente.');
						await client.sendText(chatId, messages.welcome);
						stateManage.setState(chatId, { currentState: 'MENU' });
						console.log('Datos guardados:', data);
					}
				}
		}
	});
}
