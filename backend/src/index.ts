import "dotenv/config";

import WebSocket, { WebSocketServer } from "ws";

import { IUser } from "./Auth/userHandler";
import { IncomingMessage } from "http";
import { connect } from "mongoose";
import cookieParser from "cookie-parser";
import express from "express";
import { handleMessages } from "./Conversations/wsHandler";
import setupAuthApiEndpoints from "./Auth/apiEndpoints";
import setupConversationApiEndpoints from "./Conversations/apiEndpoints";
import { validateSession } from "./Auth/sessionHandler";
import cors from "cors";

// Connect to database
connect(`mongodb://${process.env.DB_HOST}:27017/${process.env.DB_NAME}`);

// Setup express server
const expressServer = express();
const expressPort = 8080;

expressServer.use(cors(
	{
		origin: "http://169.254.136.52:3000",
		credentials: true
	}
))

expressServer.use(cookieParser());

setupAuthApiEndpoints(expressServer);
setupConversationApiEndpoints(expressServer);

expressServer.listen(expressPort, () => {
	console.log(`REST api listening on ${expressPort}`);
});

// Setup WebSocket server
const WSPort = 8081;
const WSServer = new WebSocketServer({ port: WSPort });

const WSClients: { ws: WebSocket; user: IUser }[] = [];

WSServer.on("connection", (ws: WebSocket, req: IncomingMessage) => {
	const cookies = req.headers.cookie.split(";");
	// Find session using regex
	const session = cookies.find((cookie) => /^session\=.*$/.test(cookie)).replace("session=","");

	// Add client to connection pool if authenticated
	validateSession(session)
		.then((user) => {
			WSClients.push({ ws: ws, user: user });
			handleMessages(ws, user, WSClients);

			// Remove client on disconnect
			ws.on("close", (err, reason) => {
				const wsIndex = WSClients.findIndex((ws) => ws.user == user);
				WSClients.splice(wsIndex, 1);
			});
		})
		.catch((err) =>ws.close(1011, err.message));
});

console.log(`WebSocket server is listening on ${WSPort}`);
