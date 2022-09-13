import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

export async function middleware(request: NextRequest) {
	const session = request.cookies.get("session");

	const sessionFound = await new Promise<boolean>((resolve, reject) => {
		if (session) {
			fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/session`, { method: "POST", body: session }).then((res) => {
				resolve(res.status == 200);
			});
		} else {
			resolve(false);
		}
	});

	if (!sessionFound) return NextResponse.redirect(new URL("/signin", request.url));
}

export const config = {
	matcher: "/app/:path*",
};
