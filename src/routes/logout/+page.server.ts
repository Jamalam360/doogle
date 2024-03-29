import { redirect } from "@sveltejs/kit";
import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = async ({ locals: { getSession, supabase } }) => {
	const session = await getSession();

	if (session) {
		await supabase.auth.signOut();
	}

	throw redirect(303, "/login");
};
