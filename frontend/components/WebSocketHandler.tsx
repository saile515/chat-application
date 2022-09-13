import { GetStaticProps, InferGetStaticPropsType } from "next";
import { useContext, useEffect } from "react";

import { GlobalState } from "../pages/_app";

export default function WebSocketHandler() {
	const [webSocket, setWebSocket] = useContext(GlobalState).WebSocket;

	useEffect(() => {
		if (webSocket) return;
		const ws = new WebSocket(`${process.env.NEXT_PUBLIC_WEBSOCKET_URL}`);
		setWebSocket(ws);
	}, []);

	return <></>;
}
