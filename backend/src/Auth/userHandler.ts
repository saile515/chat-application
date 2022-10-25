import * as sessionHandler from "./SessionHandler";

import { compare, genSalt, hash } from "bcrypt";
import mongoose, { Model, Schema, model } from "mongoose";

export interface IUser {
	username: string;
	email?: string;
	password?: string;
}

// Init schema and model
const userSchema = new Schema<IUser>({
	username: { type: String, required: true, unique: true },
	email: { type: String, required: true, unique: true },
	password: { type: String, required: true },
});

const User = (mongoose.models.User as Model<IUser>) || model<IUser>("User", userSchema);

export function createUser(data: IUser) {
	return new Promise<{ status: number; message?: string }>(async (resolve, reject) => {
		// Validate that credentials are unique
		const duplicate = await User.findOne({ $or: [{ username: data.username }, { email: data.email }] }).exec();
		if (duplicate) {
			resolve({ status: 400, message: "A user with that username or email already exists!" });
			return;
		}

		// Hash password
		genSalt(10, function (err, salt) {
			hash(data.password, salt, async function (err, hash) {
				// Handle errors
				if (err) {
					resolve({ status: 500, message: "Unkown server error." });
					return;
				}

				const userDetails: IUser = { ...data, password: hash };

				// Save user to DB
				const user = new User(userDetails);
				await user.save();
				resolve({ status: 200 });
			});
		});
	});
}

export function getUser(data: IUser) {
	return new Promise<IUser>(async (resolve, reject) => {
		// Search DB for user
		const user = await User.findOne({ username: data.username }).exec();
		if (!user) {
			reject({ status: 404, message: "User not found!" });
			return;
		}

		delete user.password;

		resolve(user);
	});
}

export function signIn(data: IUser) {
	return new Promise<string>(async (resolve, reject) => {
		// Search DB for user
		const user = await User.findOne({ username: data.username }).exec();

		if (!user) {
			reject({ status: 400, message: "User doesn't exist!" });
			return;
		}

		// Check if password matches hash
		const result = await compare(data.password, user.password);

		if (!result) {
			reject({ status: 400, message: "Invalid credentials!" });
			return;
		}

		// Create user/session pair in DB
		const session = await sessionHandler.createSession(data);

		resolve(session);
	});
}
