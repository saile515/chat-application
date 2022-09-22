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
		addUser();
		const data = { members: members };

		fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/conversation`, {
			method: "POST",
			body: JSON.stringify(data),
			headers: {
				"Content-Type": "application/json",
			},
		}).then((res) => {
			if (res.status == 200) {
				props.callback();
			}
		});
	}

	function addUser() {
		if (!userInputRef.current || userInputRef.current.value == "") return;

		setMembers([...new Set([...members, userInputRef.current.value])]);

		userInputRef.current.value = "";
	}

	return (
		<div className="w-full h-full fixed flex items-center justify-center bg-gray-500 bg-opacity-40">
			<div className="flex flex-col items-center bg-gray-50 py-8 max-w-md w-10/12 relative">
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
					placeholder="Username"
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
				<button onClick={props.callback} className="rotate-45 absolute top-2 right-2 text-xl w-4 h-4 flex justify-center items-center pb-1">
					+
				</button>
			</div>
		</div>
	);
}

export default function ConversationBrowser() {
	const [conversations, setConversations] = useState<Conversation[]>([]);
	const [createMenuOpen, setCreateMenuOpen] = useState<boolean>(false);
	const [user] = useContext(GlobalState).user;
	const [activeConversation, setActiveConversation] = useContext(GlobalState).activeConversation;

	useEffect(() => {
		fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/conversations`).then(async (res) => {
			if (res.status == 200) {
				setConversations(await res.json());
			}
		});
	}, []);

	useEffect(() => {
		if (conversations[0]) setActiveConversation(conversations[0]._id);
	}, [conversations]);

	return (
		<div className="w-80 h-screen bg-white relative flex-shrink-0">
			{createMenuOpen && <ConversationCreator callback={() => setCreateMenuOpen(false)} />}
			{!createMenuOpen && (
				<button
					onClick={() => setCreateMenuOpen(true)}
					className="flex justify-center items-center font-black text-4xl h-10 w-10 text-gray-50 bg-blue-700 hover:bg-blue-600 border-t border-gray-50 m-2 pb-1.5 rounded-full shadow position absolute bottom-4 right-4">
					+
				</button>
			)}
			<ul>
				{conversations.map((item) => (
					<li key={item._id} className="border-b border-color-gray-200 p-2" onClick={() => setActiveConversation(item._id)}>
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
