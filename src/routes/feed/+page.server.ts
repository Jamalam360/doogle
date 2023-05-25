import { redirect } from "@sveltejs/kit";
import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = async ({ locals: { getSession, supabase } }) => {
	const session = await getSession();

	if (!session) {
		throw redirect(303, "/login");
	}

	const { data, error } = await supabase
		.from("posts")
		.select("*")
		.order("created_at", { ascending: false })
		.eq("approved", true)
		.limit(10);

	if (error) {
		console.error(error);
	}

	const { data: reactions, error: votesError } = await supabase
		.from("post_reactions")
		.select("*")
		.eq("user_id", session.user.id);

	if (votesError) {
		console.error(votesError);
	}

	return {
		session,
		user: session.user,
		posts: (data || []).filter((p) => (reactions || []).findIndex((r) => r.post_id === p.id) == -1),
	};
};
