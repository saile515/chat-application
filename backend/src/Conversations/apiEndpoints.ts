import * as sessionHandler from "../Auth/sessionHandler";

import { Express, json } from "express";
import { createConversation, getConversations } from "./conversationHandler";

import { IUser } from "../Auth/userHandler";

// Manage all conversation related endpoints
export default function setupConversationApiEndpoints(app: Express) {
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

	app.post("/conversation", json(), async (req, res) => {
		const session: IUser = await sessionHandler.validateSession(req.cookies.session).catch((err) => {
			res.status(err.status).send(err.message);
			return null;
		});

		createConversation([...req.body.members, session.username]).then((data) => res.status(data.status).send(data.message));
	});
}
