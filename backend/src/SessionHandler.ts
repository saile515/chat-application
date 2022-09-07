import { Schema, model } from "mongoose";

import { IUser } from "./UserHandler";
import { randomUUID } from "crypto";

interface ISession {
	username: string;
	value: string;
}

// Init schema and model
const SessionSchema = new Schema<ISession>({
	username: { type: String, required: true, unique: true },
	value: { type: String, required: true },
});

const Session = model<ISession>("User", SessionSchema);

export default class SessionHandler {
	constructor() {}

	createSession(user: IUser) {
		return new Promise<string>(async (resolve, reject) => {
			// Clear previous session
			this.deleteSession(user);

			// Create new session
			const token = randomUUID();

			const session = new Session({ username: user.username, value: token });
			await session.save();

			resolve(token);
		});
	}

	validateSession(user: IUser, token: string) {
		return new Promise(async (resolve, reject) => {
			const result = await Session.findOne({ username: user.username, token: token }).exec();

			if (!result) {
				reject({ status: 400, message: "Session invalid!" });
				return;
			}

			resolve(true);
		});
	}

	deleteSession(user: IUser) {
		Session.findOneAndRemove({ username: user.username }).exec();
	}
}
