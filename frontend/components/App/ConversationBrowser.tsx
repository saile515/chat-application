import { FormEvent, useEffect, useState } from "react";

import { Conversation } from "./types";

function ConversationCreator(props: { callback?: () => any }) {
	function handleSubmit(event: FormEvent) {
		event.preventDefault();
		fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/conversation`, { method: "POST" });
	}
	return (
		<form onSubmit={handleSubmit}>
			<input type="submit" value="create conversation" />
		</form>
	);
}

export default function ConversationBrowser() {
	const [conversations, setConversations] = useState<Conversation[]>([]);
	const [createMenuOpen, setCreateMenuOpen] = useState<boolean>(false);

	useEffect(() => {
		fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/conversations`).then(async (res) => {
			if (res.status == 200) {
				setConversations(await res.json());
			}
		});
	}, []);

	return (
		<div className="w-80 h-screen bg-gray-100 border-r border-color-gray-200">
			{createMenuOpen && <ConversationCreator callback={() => setCreateMenuOpen(false)} />}
			{!createMenuOpen && (
				<button onClick={() => setCreateMenuOpen(true)} className="w-full text-center py-2 bg-white">
					Create conversation
				</button>
			)}
			<ul>
				{conversations.map((item) => (
					<li key={item._id} className="border-b border-color-gray-200">
						<p className="font-bold">{item.members.toString()}</p>
						<p>{item.messages[item.messages.length - 1].content}</p>
					</li>
				))}
			</ul>
		</div>
	);
}
