import type { Session, SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "./database.types";

export function getCSSCustomProp(propKey: string, element = document.documentElement, castAs = "string") {
	let response = getComputedStyle(element).getPropertyValue(propKey);

	if (response.length) {
		response = response.replace(/\\'|"/g, "").trim();
	}

	switch (castAs) {
		case "number":
		case "int":
			return parseInt(response);
		case "float":
			return parseFloat(response);
		case "boolean":
		case "bool":
			return response === "true" || response === "1";
	}

	return response;
}

export async function voteOnPost(supabase: SupabaseClient<Database>, session: Session, post: Database["public"]["Tables"]["posts"]["Row"], action: "upvote" | "downvote") {
    const { error } = await supabase
        .from("post_reactions")
        .insert({
            post_id: post.id,
            user_id: session.user.id,
            reaction: action === "upvote",
        })
        .single();

    if (error) {
        console.error(error);
    }
}
