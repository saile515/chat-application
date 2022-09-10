import "dotenv/config";

import { connect } from "mongoose";
import express from "express";
import setupAuthApiEndpoints from "./Auth/apiEndpoints";

export const app = express();
const port = 8080;

connect(`mongodb://${process.env.DB_HOST}:27017/${process.env.DB_NAME}`);

setupAuthApiEndpoints();

app.listen(port, () => {
	console.log(`Example app listening on port ${port}`);
});
