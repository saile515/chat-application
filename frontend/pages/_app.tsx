import "../styles/globals.css";

import { Dispatch, SetStateAction, createContext, useEffect, useState } from "react";

import type { AppProps } from "next/app";
import { User } from "../components/Auth/types";

type State<T> = [T, Dispatch<SetStateAction<T>>];

interface GlobalState {
	WebSocket: State<WebSocket>;
	user: State<User>;
	activeConversation: State<string>;
}

export const GlobalState = createContext<GlobalState>({} as GlobalState);

function MyApp({ Component, pageProps }: AppProps) {
	const globalState: GlobalState = {
		WebSocket: useState<WebSocket>(),
		user: useState<User>(),
		activeConversation: useState<string>(),
	};

	return (
		<GlobalState.Provider value={globalState}>
			<Component {...pageProps} />
		</GlobalState.Provider>
	);
}

export default MyApp;
