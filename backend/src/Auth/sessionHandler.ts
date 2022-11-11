import { IUser, getUser } from "./userHandler";
import mongoose, { Model, Schema, model } from "mongoose";

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

// Use model if availble, otherwise create new
const Session = (mongoose.models.Session as Model<ISession>) || model<ISession>("Session", sessionSchema);

export function createSession(user: IUser) {
	return new Promise<string>(async (resolve, reject) => {
		// Clear previous session
		this.deleteSession(user);

		// Create new session id
		const token = randomUUID();

		// Create session
		const session = new Session({ username: user.username, value: token });
		await session.save();

		resolve(token);
	});
}

export function validateSession(token: string) {
	return new Promise<IUser>(async (resolve, reject) => {
		// Search DB for session
		const result = await Session.findOne({ value: token }).exec();

		// Reject if no session is found
		if (!result) {
			reject({ status: 400, message: "Session invalid!" });
			return;
		}

		// If session is found, get user information
		getUser(result)
			.then((user) => resolve(user))
			.catch((res) => reject({ status: 400, message: "User not found!" }));
	});
}

export function deleteSession(user: IUser) {
	// Delete session from DB
	Session.findOneAndDelete({ username: user.username }).exec();
}
