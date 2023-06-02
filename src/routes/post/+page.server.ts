import { fail, redirect } from "@sveltejs/kit";
import type { Actions } from "@sveltejs/kit";
import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = async ({ locals: { getSession } }) => {
	const session = await getSession();

	if (!session) {
		throw redirect(303, "/login");
	}

	return { session, user: session.user };
};

export const actions: Actions = {
	default: async ({ locals: { supabase, getSession }, request }) => {
		const session = await getSession();

		if (!session) {
			throw redirect(303, "/login");
		}

		const formData = await request.formData();
		const file = formData.get("file") as File | null;

		if (!file) {
			return fail(400, { data: "no file lol" });
		}

		const contentType = getContentType(file.name);

		if (!contentType) {
			return fail(400, { data: "invalid file type" });
		}

		const fileName = crypto.randomUUID() + "." + file.name.split(".").pop();

		const { data: sd, error: se } = await supabase.storage
			.from("images")
			.upload(`${session.user.id}/${fileName}`, file, {
				contentType,
			});

		if (se || !sd) {
			return fail(400, { data: se });
		}

		const {
			data: { publicUrl },
		} = supabase.storage.from("images").getPublicUrl(sd.path);
		const { error: ie } = await supabase.from("posts").insert({ image: publicUrl, user_id: session.user.id, blurhash_placeholder: formData.get("blurhash_placeholder") as string });

		if (ie) {
			return fail(400, { data: ie });
		}

		throw redirect(303, "/feed");
	},
};

function getContentType(path: string): string | undefined {
	const ext = path.split(".").pop();
	if (ext === "png") return "image/png";
	if (ext === "jpg" || ext === "jpeg") return "image/jpeg";
	if (ext === "gif") return "image/gif";
	if (ext === "webp") return "image/webp";
}
