import { GetStaticProps, InferGetStaticPropsType } from "next";
import { useContext, useEffect } from "react";

import { GlobalState } from "../../pages/_app";

export default function InitialAuth({ env }: InferGetStaticPropsType<typeof getStaticProps>) {
	const [user, setUser] = useContext(GlobalState).user;

	useEffect(() => {
		if (user) return;

		// Get cookie
		const sessionCookie = document.cookie
			.split("; ")
			.find((row) => row.startsWith("session="))
			?.split("=")[1];

		if (!sessionCookie) return;

		// Validate session with server
		fetch(`${env.BACKEND_URL}/session`, { method: "POST", body: sessionCookie }).then(async (user) => setUser(await user.json()));
	}, []);

	return <></>;
}

export const getStaticProps: GetStaticProps = async () => {
	return {
		props: { env: process.env },
	};
};
