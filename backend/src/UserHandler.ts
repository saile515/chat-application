import { Schema, model } from "mongoose";
import { compare, genSalt, hash } from "bcrypt";

import SessionHandler from "./SessionHandler";

export interface IUser {
	username: string;
	email?: string;
	password?: string;
}

// Init schema and model
const UserSchema = new Schema<IUser>({
	username: { type: String, required: true, unique: true },
	email: { type: String, required: true, unique: true },
	password: { type: String, required: true },
});

const User = model<IUser>("User", UserSchema);

export default class UserHandler {
	sessionHandler: SessionHandler;

	constructor() {
		this.sessionHandler = new SessionHandler();
	}

	createUser(data: IUser) {
		return new Promise((resolve, reject) => {
			// Validate that credentials are unique
			const unique = new Boolean(User.findOne({ $or: [{ username: data.username }, { email: data.email }] }));
			if (!unique) {
				reject({ status: 400, message: "A user with that username or email already exists!" });
				return;
			}

			// Hash password
			genSalt(10, function (err, salt) {
				hash(data.password, salt, async function (err, hash) {
					// Handle errors
					if (err) {
						reject(err);
						return;
					}

					const userDetails: IUser = { ...data, password: hash };

					// Save user to DB
					const user = new User(userDetails);
					await user.save();
					resolve(user);
				});
			});
		});
	}

	getUser(data: IUser) {
		return new Promise(async (resolve, reject) => {
			const user = await User.findOne({ username: data.username }).exec();

			if (!user) {
				reject({ status: 404, message: "User not found!" });
				return;
			}

			resolve(user);
		});
	}

	login(data: IUser) {
		return new Promise<string>(async (resolve, reject) => {
			const user = await User.findOne({ username: data.username }).exec();

			const result = await compare(data.password, user.password);

			if (!result) {
				reject({ status: 400, message: "Invalid credentials!" });
				return;
			}

			const session = this.sessionHandler.createSession(data);

			resolve(session);
		});
	}
}
