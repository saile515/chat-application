export interface Message {
	sender: string;
	content: string;
	date: string;
}

export interface Conversation {
	members: string[];
	messages: Message[];
	_id?: string;
}
