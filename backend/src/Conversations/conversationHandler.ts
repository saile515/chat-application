import mongoose, { Model, Schema, model } from "mongoose";

import { IUser } from "../Auth/userHandler";

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

const Conversation = (mongoose.models.Conversation as Model<IConversation>) || model<IConversation>("Conversation", conversationSchema);

export function createConversation(members: string[]) {
	const conversation = new Conversation();
	conversation.members = members;

	return new Promise<{ status: number; message?: string }>((resolve, reject) => {
		// Save conversation to database
		conversation
			.save()
			.then(() => {
				resolve({ status: 200 });
			})
			.catch(() => {
				reject({ status: 500, message: "Unknown server error!" });
			});
	});
}

export function getConversation(id: string) {
	return new Promise<IConversation>(async (resolve, reject) => {
		const conversation = await Conversation.findById(id);

		if (!conversation) {
			reject({ status: 400, message: "Conversation not found!" });
			return;
		}

		resolve(conversation);
	});
}

export function getConversations(user: string) {
	return new Promise<IConversation[]>(async (resolve, reject) => {
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
