export interface Message {
	sender: string;
	content: string;
	date: Date;
}

export interface Conversation {
	members: string[];
	messages: Message[];
	_id?: string;
}
