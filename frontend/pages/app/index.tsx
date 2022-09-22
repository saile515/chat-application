import Chat from "../../components/App/Chat";
import ConversationBrowser from "../../components/App/ConversationBrowser";
import { GlobalState } from "../_app";
import InitialAuth from "../../components/Auth/InitialAuth";
import type { NextPage } from "next";
import WebSocketHandler from "../../components/WebSocketHandler";
import { useContext } from "react";

const App: NextPage = () => {
	const [activeConversation] = useContext(GlobalState).activeConversation;

	return (
		<div className="w-screen h-screen flex overflow-hidden">
			<ConversationBrowser />
			{activeConversation && <Chat />}
			<InitialAuth />
			<WebSocketHandler />
		</div>
	);
};

export default App;
