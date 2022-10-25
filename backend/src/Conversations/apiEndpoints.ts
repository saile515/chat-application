import * as sessionHandler from "../Auth/sessionHandler";

import { Express, json } from "express";
import { createConversation, getConversation, getConversations } from "./conversationHandler";

import { IUser } from "../Auth/userHandler";

// Manage all conversation related endpoints
export default function setupConversationApiEndpoints(app: Express) {
	// Get all conversations
	app.get("/conversations", async (req, res) => {
		// Get session, send error if not authenticated
		const session: IUser = await sessionHandler.validateSession(req.cookies.session).catch((err) => {
			res.status(err.status).send(err.message);
			return null;
		});

		if (!session) return;

		const conversations = await getConversations(session.username);

		res.status(200).send(JSON.stringify(conversations));
	});

	// Get one conversation
	app.get("/conversation/:id", async (req, res) => {
		const session: IUser = await sessionHandler.validateSession(req.cookies.session).catch((err) => {
			res.status(err.status).send(err.message);
			return null;
		});

		if (!session) return;

		const conversation = await getConversation(req.params.id);

		res.status(200).send(JSON.stringify(conversation));
	});

	// Create conversation
	app.post("/conversation", json(), async (req, res) => {
		if (!req.body.members) return;

		console.log(req.cookies.session)

		const session: IUser = await sessionHandler.validateSession(req.cookies.session).catch((err) => {
			res.status(err.status).send(err.message);
			return null;
		});

		if (!session) return;

		createConversation([...req.body.members, session.username]).then((data) => res.status(data.status).send(data.message));
	});
}
