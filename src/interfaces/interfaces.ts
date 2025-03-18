import { Whatsapp } from '@wppconnect-team/wppconnect';

export interface Bot {
	client: Whatsapp;
}

export interface ChatState {
	currentState: 'INITIAL' | 'MENU' | 'INFO' | 'SCHEDULE' | 'CENSUS' | 'PAYMENT';
	lastMessage: string;
	lastMessageTime?: number;
}

export interface ListMessageOptions {
	buttonText: string;
	description: string;
	sections: Array<{
		title: string;
		rows: Array<{
			rowId: string;
			title: string;
			description?: string;
		}>;
	}>;
}
