import { FormEvent, useState } from "react";
import type { GetStaticProps, InferGetStaticPropsType, NextPage } from "next";

import AuthContainer from "../components/Auth/AuthContainer";
import Input from "../components/Auth/Input";
import Link from "next/link";
import Submit from "../components/Auth/Submit";
import { useRouter } from "next/router";

const SignIn: NextPage = () => {
	const [errorMessage, setErrorMessage] = useState<null | string>(null);
	const router = useRouter();

	function handleSubmit(event: FormEvent) {
		event.preventDefault();
		const target = event.target as typeof event.target & {
			username: { value: string };
			password: { value: string };
			retain: { checked: boolean };
		};

		const data = {
			username: target.username.value,
			password: target.password.value,
		};

		fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/signin`, {
			method: "POST",
			body: JSON.stringify(data),
			headers: {
				"Content-Type": "application/json",
			},
		}).then(async (res) => {
			if (res.status != 200) setErrorMessage(await res.text());
			else {
				// Set expiration 365 days in future
				const date = new Date();
				date.setDate(date.getDate() + 365);

				document.cookie = `session=${await res.text()}; expires=${target.retain.checked ? date.toUTCString() : "session"}`;

				router.push("/app");
			}
		});
	}

	return (
		<div className="flex justify-center items-center h-screen bg-gray-200">
			<AuthContainer label="Sign in" onSubmit={handleSubmit}>
				<Input label="Username" />
				<Input label="Password" type="password" />
				<p className="text-red-500 mt-2">{errorMessage}</p>
				<label htmlFor="retain" className="flex items-baseline">
					<span>Remember me?</span>
					<input type="checkbox" name="retain" id="retain" className="w-3 h-3 m-1" />
				</label>
				<Submit label="Sign in" />
				<p>
					Don&apos;t have an account?{" "}
					<Link href="/signup" className="text-blue-500">
						Sign up
					</Link>
				</p>
			</AuthContainer>
		</div>
	);
};

export default SignIn;
