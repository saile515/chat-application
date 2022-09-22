import { KeyboardEvent, useContext, useEffect, useState } from "react";

import { Conversation } from "./types";
import { GlobalState } from "../../pages/_app";

export default function Chat() {
	const {
		activeConversation: [activeConversation],
		WebSocket: [WebSocket],
	} = useContext(GlobalState);
	const [conversation, setConversation] = useState<Conversation>();

	useEffect(() => {
		function updateMessages(event: MessageEvent) {
			const update = JSON.parse(event.data);

			if (update.conversation != activeConversation) return;

			const conversationCopy = { ...conversation };
			conversationCopy.messages.unshift(update.message);
			setConversation(conversationCopy);
		}

		WebSocket.addEventListener("message", updateMessages);

		return () => {
			WebSocket.removeEventListener("message", updateMessages);
		};
	}, [WebSocket, conversation]);

	useEffect(() => {
		fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/conversation/${activeConversation}`)
			.then((res) => res.json())
			.then((res: Conversation) => {
				res.messages?.reverse();
				setConversation(res);
			});
	}, [activeConversation]);

	function sendMessage(event: KeyboardEvent<HTMLSpanElement>) {
		const content = (event.target as HTMLElement).innerText;

		const data = {
			conversation: activeConversation,
			content: content,
		};

		WebSocket.send(JSON.stringify(data));

		(event.target as HTMLElement).innerHTML = "";
	}

	return (
		<div className="w-full max-w-[calc(100vw-20rem)] h-full bg-gray-100 flex flex-col">
			<div className="h-full overflow-hidden">
				{conversation ? (
					<ol className="flex flex-col-reverse h-full overflow-y-auto">
						{conversation.messages?.map((message) => (
							<li key={message.date + message.sender} className="p-2 border-t flex flex-wrap">
								<p className="font-bold mr-2">{message.sender}</p>
								<p className="text-xs font-bold text-gray-600 leading-6 align-center">
									{new Date(message.date).toLocaleString(undefined, { dateStyle: "short", timeStyle: "short" })}
								</p>
								<div className="basis-full h-0"></div>
								<p className="whitespace-pre-line">{message.content}</p>
							</li>
						))}
					</ol>
				) : (
					<div></div>
				)}
			</div>
			<div className="flex items-center bg-gray-200">
				<span
					onKeyDown={(event) => {
						if (event.key == "Enter" && !event.shiftKey) {
							event.preventDefault();
							sendMessage(event);
						}
					}}
					className="max-h-96 min-h-8 m-2 px-2 bg-white w-full overflow-y-auto break-words"
					role="textarea"
					contentEditable></span>
			</div>
		</div>
	);
}
