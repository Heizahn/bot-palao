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
			});
		}

		return this.states.get(chatId)!;
	}

	public setState(chatId: string, state: Partial<ChatState>): void {
		const currentState = this.getState(chatId);
		this.states.set(chatId, { ...currentState, ...state });
	}

	public resetState(chatId: string): void {
		this.states.delete(chatId);
	}
}

export const stateManage = new ChatStateManager();
