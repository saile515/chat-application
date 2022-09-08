import { FormEvent, useState } from "react";
import type { GetStaticProps, InferGetStaticPropsType, NextPage } from "next";

import AuthContainer from "../components/Auth/AuthContainer";
import Input from "../components/Auth/Input";
import Submit from "../components/Auth/Submit";
import { useRouter } from "next/router";

const SignIn: NextPage = ({ env }: InferGetStaticPropsType<typeof getStaticProps>) => {
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

		fetch(`${env.BACKEND_URL}/signin`, {
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

				router.push("/");
			}
		});
	}

	return (
		<div className="flex justify-center items-center h-screen bg-gray-200">
			<AuthContainer label="Sign in" onSubmit={handleSubmit}>
				<Input label="Username" />
				<Input label="Password" type="password" />
				<p className="text-red-500 mt-2">{errorMessage}</p>
				<label htmlFor="retain">
					Remember me?
					<input type="checkbox" name="retain" id="retain" />
				</label>
				<Submit label="Sign in" />
				<p>
					Don't have an account?{" "}
					<a href="/signin" className="text-blue-500">
						Sign up
					</a>
				</p>
			</AuthContainer>
		</div>
	);
};

export const getStaticProps: GetStaticProps = async () => {
	return {
		props: { env: process.env },
	};
};

export default SignIn;
