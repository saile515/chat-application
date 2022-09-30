import { FormEvent, useState } from "react";
import type { GetStaticProps, InferGetStaticPropsType, NextPage } from "next";

import AuthContainer from "../components/Auth/AuthContainer";
import Input from "../components/Auth/Input";
import Link from "next/link";
import Submit from "../components/Auth/Submit";
import { useRouter } from "next/router";

const SignUp: NextPage = () => {
	const [errorMessage, setErrorMessage] = useState<null | string>(null);
	const router = useRouter();

	function handleSubmit(event: FormEvent) {
		event.preventDefault();
		const target = event.target as typeof event.target & {
			username: { value: string };
			email: { value: string };
			password: { value: string };
		};

		const data = {
			username: target.username.value,
			email: target.email.value,
			password: target.password.value,
		};

		fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/signup`, {
			method: "POST",
			body: JSON.stringify(data),
			headers: {
				"Content-Type": "application/json",
			},
		}).then(async (res) => {
			if (res.status != 200) setErrorMessage(await res.text());
			else router.push("/signin");
		});
	}

	return (
		<div className="flex justify-center items-center h-screen bg-gray-200">
			<AuthContainer label="Sign up" onSubmit={handleSubmit}>
				<Input label="Username" />
				<Input label="Email" type="email" />
				<Input label="Password" type="password" />
				<p className="text-red-500 mt-2">{errorMessage}</p>
				<Submit label="Sign up" />
				<p>
					Already have an account?{" "}
					<Link href="/signin" className="text-blue-500">
						Sign in
					</Link>
				</p>
			</AuthContainer>
		</div>
	);
};

export default SignUp;
