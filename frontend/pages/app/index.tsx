import ConversationBrowser from "../../components/App/ConversationBrowser";
import InitialAuth from "../../components/Auth/InitialAuth";
import type { NextPage } from "next";
import WebSocketHandler from "../../components/WebSocketHandler";

const App: NextPage = () => {
	return (
		<div className="w-screen h-screen">
			<ConversationBrowser />
			<InitialAuth />
			<WebSocketHandler />
		</div>
	);
};

export default App;
