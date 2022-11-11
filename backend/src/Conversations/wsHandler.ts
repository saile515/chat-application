import { Message, getConversation, postMessage } from "./conversationHandler";

import { IUser } from "../Auth/userHandler";
import { WebSocket } from "ws";

export function handleMessages(ws: WebSocket, user: IUser, clientList: { ws: WebSocket; user: IUser }[]) {
	// Handle WebSocket message
	ws.on("message", (data) => {
		const message = JSON.parse(data.toString());

		getConversation(message.conversation)
			.then((conversation) => {
				// If user is part of conversation, post message
				if (conversation.members.find((member) => member == user.username)) {
					const messageData = { sender: user.username, content: message.content, date: new Date() };

					// Create message in DB
					postMessage(message.conversation, messageData)
						.then(() => {
							// Update members through websocket
							pushUpdates(message.conversation, messageData);
						})
						.catch((err) => {
							console.error(err);
						});
				}
			})
			.catch((err) => console.error(err));
	});

	// Send conversation updates to clients
	async function pushUpdates(conversationID: string, message: Message) {
		const conversation = await getConversation(conversationID);
		const onlineClients: { ws: WebSocket; user: IUser }[] = [];

		// Find which users are active
		conversation.members.forEach((user) => {
			const activeClient = clientList.find((client) => user == client.user.username);
			if (activeClient) {
				onlineClients.push(activeClient);
			}
		});

		const data = {
			conversation: conversationID,
			message: message,
		};

		// Send data to active clients
		onlineClients.forEach((client) => {
			client.ws.send(JSON.stringify(data));
		});
	}
}
