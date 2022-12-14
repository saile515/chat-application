import mongoose, { Model, Schema, model } from "mongoose";

export interface Message {
	sender: string;
	content: string;
	date: Date;
}

export interface IConversation {
	members: string[];
	messages: Message[];
	_id?: string;
}

// Init schema and model
const conversationSchema = new Schema<IConversation>({
	members: { type: [String], required: true },
	messages: {
		type: [
			{
				sender: { type: String, required: true },
				content: { type: String, required: true },
				date: { type: Date, required: true },
			},
		],
		required: true,
	},
});

// Use model if availble, otherwise create new
const Conversation = (mongoose.models.Conversation as Model<IConversation>) || model<IConversation>("Conversation", conversationSchema);

export function createConversation(members: string[]) {
	const conversation = new Conversation();
	conversation.members = members;

	return new Promise<{ status: number; message?: string }>((resolve, reject) => {
		// Save conversation to database
		conversation
			.save()
			.then(() => { // Success
				resolve({ status: 200 });
			})
			.catch(() => { // Error
				reject({ status: 500, message: "Unknown server error!" });
			});
	});
}

export function getConversation(id: string) {
	return new Promise<IConversation>(async (resolve, reject) => {
		// Search DB for conversation
		const conversation = await Conversation.findById(id);

		// Reject if no conversation is found
		if (!conversation) {
			reject({ status: 400, message: "Conversation not found!" });
			return;
		}

		resolve(conversation);
	});
}

export function getConversations(user: string) {
	return new Promise<IConversation[]>(async (resolve, reject) => {
		// Get all conversations where user is a member
		const conversations = await Conversation.find({ members: user });

		resolve(conversations);
	});
}

export function postMessage(id: string, message: Message) {
	return new Promise<{ status: number; message?: string }>((resolve, reject) => {
		// Push message to document
		Conversation.findByIdAndUpdate(id, { $push: { messages: message } })
			.exec()
			.then(() => {
				resolve({ status: 200 });
			})
			.catch(() => {
				reject({ status: 500, message: "Unknown server error!" });
			});
	});
}
