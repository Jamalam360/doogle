import type { LayoutServerLoad } from "./$types";

export const load: LayoutServerLoad = async ({ url, locals: { getSession } }) => {
	return {
		session: await getSession(),
		path: url.pathname,
	};
};
