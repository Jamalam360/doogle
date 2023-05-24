import { fail, redirect } from "@sveltejs/kit";
import type { Actions } from "@sveltejs/kit";
import type { PageServerLoad } from "./$types";
import { lookup } from "mime-types";

export const load: PageServerLoad = async ({ locals: { getSession, supabase } }) => {
	const session = await getSession();

	if (!session) {
		throw redirect(303, "/login");
	}

	const { data, error } = await supabase.from("posts").select("*").order("created_at", { ascending: false }).limit(10);
	console.error(error);
	return { session, user: session.user, posts: data };
};

export const actions: Actions = {
	default: async ({ locals: { supabase, getSession }, request }) => {
		const session = await getSession();

		if (!session) {
			throw redirect(303, "/login");
		}

		const file = (await request.formData()).get("file") as File | null;

		if (!file) {
			return fail(400, { data: "no file lol" });
		}

		const { data: sd, error: se } = await supabase.storage
			.from("images")
			.upload(`${session.user.id}/${file.name}`, file, {
				contentType: lookup(file.name) || "image/jpeg",
			});

		if (se || !sd) {
			return fail(400, { data: se });
		}

		const {
			data: { publicUrl },
		} = supabase.storage.from("images").getPublicUrl(sd.path);
		const { error: ie } = await supabase.from("posts").insert({ image: publicUrl, user_id: session.user.id });

		if (ie) {
			return fail(400, { data: ie });
		}

		throw redirect(303, "/feed");
	},
};