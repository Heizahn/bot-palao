import { Whatsapp } from '@wppconnect-team/wppconnect';

export interface Bot {
	client: Whatsapp;
}

export interface ChatState {
	currentState: 'INITIAL' | 'MENU' | 'INFO' | 'SCHEDULE' | 'CENSUS' | 'PAYMENT';
	lastMessage: string;
}
