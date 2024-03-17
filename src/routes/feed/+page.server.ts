import { redirect } from "@sveltejs/kit";
import type { PageServerLoad } from "./$types";

const FETCH_INCREMENT = 10;

export const load: PageServerLoad = async ({ locals: { getSession, supabase } }) => {
	const session = await getSession();

	if (!session) {
		throw redirect(303, "/login");
	}

	const { data: previousVotes } = await supabase
		.from("post_reactions")
		.select("post_id")
		.eq("user_id", session.user.id);
	
	const { data, error } = await supabase
		.from("posts")
		.select("*")
		.order("created_at", { ascending: false })
		.eq("approved", true)
		.not("id", "in", `(${(previousVotes || []).map((post) => post.post_id).join(",")})`)
		.limit(FETCH_INCREMENT);

	if (error || !data) {
		console.error(error);
	}

	return {
		session,
		user: session.user,
		posts: data || [],
		fetchIncrement: FETCH_INCREMENT,
	};
};
