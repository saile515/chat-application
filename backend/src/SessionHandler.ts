import { Schema, model } from "mongoose";

import { IUser } from "./userHandler";
import { randomUUID } from "crypto";

interface ISession {
	username: string;
	value: string;
}

// Init schema and model
const sessionSchema = new Schema<ISession>({
	username: { type: String, required: true, unique: true },
	value: { type: String, required: true },
});

const Session = model<ISession>("Session", sessionSchema);

export function createSession(user: IUser) {
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

export function validateSession(user: IUser, token: string) {
	return new Promise(async (resolve, reject) => {
		const result = await Session.findOne({ username: user.username, token: token }).exec();

		if (!result) {
			reject({ status: 400, message: "Session invalid!" });
			return;
		}

		resolve(true);
	});
}

export function deleteSession(user: IUser) {
	Session.findOneAndRemove({ username: user.username }).exec();
}
