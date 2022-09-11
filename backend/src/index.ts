import "dotenv/config";

import WebSocket, { WebSocketServer } from "ws";

import { IncomingMessage } from "http";
import { connect } from "mongoose";
import express from "express";
import setupAuthApiEndpoints from "./Auth/apiEndpoints";
import { validateSession } from "./Auth/sessionHandler";

// Connect to database
connect(`mongodb://${process.env.DB_HOST}:27017/${process.env.DB_NAME}`);

// Setup express server
const expressServer = express();
const expressPort = 8080;

setupAuthApiEndpoints(expressServer);

expressServer.listen(expressPort, () => {
	console.log(`REST api listening on ${expressPort}`);
});

// Setup WebSocket server
const WSPort = 8081;
const WSServer = new WebSocketServer({ port: WSPort });

const WSClients = [];

WSServer.on("connection", (ws: WebSocket, req: IncomingMessage) => {
	const cookies = req.headers.cookie.split(";");
	// Find session using regex
	const session = cookies.find((cookie) => /$session\=/.test(cookie));

	// Add client to connection pool if authenticated
	validateSession(session)
		.then((user) => WSClients.push({ ws: ws, user: user }))
		.catch((err) => ws.close(err.status, err.message));
});
