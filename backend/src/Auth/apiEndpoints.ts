import * as sessionHandler from "./sessionHandler";
import * as userHandler from "./UserHandler";

import { Express, json, text } from "express";

// Manage all authentication related endpoints
export default function setupAuthApiEndpoints(app: Express) {
	// Sign up
	app.post("/signup", json(), async (req, res) => {
		const user = await userHandler.createUser(req.body);

		res.status(user.status).send(user.message);
	});

	// Sign in
	app.post("/signin", json(), async (req, res) => {
		userHandler
			.signIn(req.body)
			.then((session) => res.status(200).send(session))
			.catch((err) => res.status(err.status).send(err.message));
	});

	// Validate session
	app.post("/session", text(), async (req, res) => {
		sessionHandler
			.validateSession(req.body)
			.then((user) => res.status(200).send(user))
			.catch((err) => res.status(err.status).send(err.message));
	});
}
