import { Dispatch, FormEvent, SetStateAction, useContext, useEffect, useRef, useState } from "react";

import { Conversation } from "./types";
import { GlobalState } from "../../pages/_app";

function NameTag(props: { members: string[]; setMembers: Dispatch<SetStateAction<string[]>>; name: string }) {
	return (
		<li className="shadow bg-white rounded-full px-2 flex items-center m-1">
			<span className=" max-w-[12rem] text-ellipsis overflow-hidden">{props.name}</span>
			<button
				className="rotate-45 text-xl leading-4 ml-2"
				onClick={() => props.setMembers(props.members.filter((member) => member != props.name))}>
				+
			</button>
		</li>
	);
}

function ConversationCreator(props: { callback?: () => any }) {
	const [members, setMembers] = useState<string[]>([]);
	const userInputRef = useRef<HTMLInputElement>();

	function handleSubmit() {
		const data = { members: members };

		fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/conversation`, {
			method: "POST",
			body: JSON.stringify(data),
			headers: {
				"Content-Type": "application/json",
			},
		});
	}

	function addUser() {
		if (!userInputRef.current || userInputRef.current.value == "") return;

		setMembers([...new Set([...members, userInputRef.current.value])]);

		userInputRef.current.value = "";
	}

	return (
		<div className="flex flex-col w-full items-center bg-gray-50 py-8">
			<h2 className="text-lg font-bold">Members</h2>
			{members.length > 0 && (
				<ul className="w-60 mb-2 flex flex-wrap">
					{members.map((member) => (
						<NameTag members={members} setMembers={setMembers} name={member} key={member} />
					))}
				</ul>
			)}

			<input
				type="text"
				ref={userInputRef}
				onKeyDown={(event) => {
					if (event.key == "Enter") {
						event.preventDefault();
						addUser();
					}
				}}
				className="w-40 px-2 border border-gray-200 rounded shadow-inner"
			/>
			<button onClick={addUser} className="px-2 py-1 m-2 rounded bg-gray-200 text-blue-700 hover:text-blue-500">
				Add user <span className="font-bold">+</span>
			</button>
			<input
				onClick={handleSubmit}
				type="submit"
				value="Create"
				className="bg-blue-500 hover:bg-blue-600 rounded px-2 py-1 text-white font-bold w-32"
			/>
		</div>
	);
}

export default function ConversationBrowser() {
	const [conversations, setConversations] = useState<Conversation[]>([]);
	const [createMenuOpen, setCreateMenuOpen] = useState<boolean>(false);
	const [user] = useContext(GlobalState).user;

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
						<p className="font-bold">
							{item.members
								.filter((member) => member != user.username)
								.toString()
								.replaceAll(",", ", ")}
						</p>
						<p>{item.messages[item.messages.length - 1]?.content || "No messages"}</p>
					</li>
				))}
			</ul>
		</div>
	);
}
