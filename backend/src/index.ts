import "dotenv/config";

import * as sessionHandler from "./SessionHandler";
import * as userHandler from "./UserHandler";

import express, { json, text } from "express";

import { connect } from "mongoose";

const app = express();
const port = 8080;

connect(`mongodb://${process.env.DB_HOST}:27017/${process.env.DB_NAME}`);

app.post("/signup", json(), async (req, res) => {
	const user = await userHandler.createUser(req.body);

	res.status(user.status).send(user.message);
});

app.post("/signin", json(), async (req, res) => {
	userHandler
		.signIn(req.body)
		.then((session) => res.status(200).send(session))
		.catch((err) => res.status(err.status).send(err.message));
});

app.post("/session", text(), async (req, res) => {
	sessionHandler
		.validateSession(req.body)
		.then((user) => res.status(200).send(user))
		.catch((err) => res.status(err.status).send(err.message));
});

app.listen(port, () => {
	console.log(`Example app listening on port ${port}`);
});
