import UserHandler from "./UserHandler";
import { connect } from "mongoose";

export default class DBHandler {
	userHandler: UserHandler;

	constructor() {
		connect(`mongodb://${process.env.DB_HOST}:27017/${process.env.DB_NAME}`);

		this.userHandler = new UserHandler();
	}
}
