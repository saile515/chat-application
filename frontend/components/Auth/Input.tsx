import { HTMLInputTypeAttribute } from "react";

export default function Input(props: { type?: HTMLInputTypeAttribute; label: string; name?: string }) {
	const name = props.name || props.label.toLowerCase();

	return (
		<label htmlFor={name} className="flex flex-col mt-2">
			{props.label}
			<input type={props.type || "text"} id={name} name={name} className="rounded-lg px-2 py-1 border border-gray-300 bg-white shadow-inner" />
		</label>
	);
}
