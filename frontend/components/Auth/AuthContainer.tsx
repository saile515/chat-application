import { FormEvent, ReactNode } from "react";

export default function AuthContainer(props: { children?: ReactNode; label: string; onSubmit?: (event: FormEvent) => any }) {
	return (
		<form method="POST" onSubmit={props.onSubmit} className="p-8 sm:p-16 bg-gray-50 flex flex-col justify-center w-11/12 max-w-lg rounded-xl">
			<h1 className="text-2xl font-black text-center">{props.label}</h1>
			{props.children}
		</form>
	);
}
