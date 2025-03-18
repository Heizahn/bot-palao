import { ChatState } from '../interfaces/interfaces';

class ChatStateManager {
	private states: Map<string, ChatState>;

	constructor() {
		this.states = new Map();
	}

	public getState(chatId: string): ChatState {
		if (!this.states.has(chatId)) {
			this.states.set(chatId, {
				currentState: 'INITIAL',
				lastMessage: '',
				lastMessageTime: Date.now(),
			});
		}

		return this.states.get(chatId)!;
	}

	public setState(chatId: string, state: Partial<ChatState>): void {
		const currentState = this.getState(chatId);
		if (!state.lastMessageTime) {
			state.lastMessageTime = Date.now();
		}
		this.states.set(chatId, { ...currentState, ...state });
	}

	public resetState(chatId: string): void {
		this.states.delete(chatId);
	}

	public areButtonsExpired(chatId: string, expirationTime: number = 60000): boolean {
		const state = this.getState(chatId);
		const currentTime = Date.now();

		if (!state.lastMessageTime) {
			false;
		}

		return state.lastMessageTime
			? currentTime - state.lastMessageTime > expirationTime
			: false;
	}

	public updateTime(chatId: string): void {
		const state = this.getState(chatId);

		this.states.set(chatId, { ...state, lastMessageTime: Date.now() });
	}
}

export const stateManage = new ChatStateManager();
