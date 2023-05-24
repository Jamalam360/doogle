<script lang="ts">
	import type { Session, SupabaseClient } from "@supabase/supabase-js";
	import type { Database } from "./database.types";

	export let supabase: SupabaseClient<Database>;
	export let session: Session;
	export let post: Database["public"]["Tables"]["posts"]["Row"];

	let voted = false;
	let upvoted = false;
	let value = 0;

	$: {
		supabase
			.from("post_reactions")
			.select("*")
			.eq("post_id", post.id)
			.eq("user_id", session.user.id)
			.single()
			.then((res) => {
				let { data, error } = res;

				if (data) {
					voted = true;
					upvoted = data.reaction;
				} else if (!data || error) {
					voted = false;
				}
			});
	}

	$: {
		supabase
			.from("post_reactions")
			.select("reaction")
			.eq("post_id", post.id)
			.then((res) => {
				let { data, error } = res;

				if (data) {
					value = data.reduce((acc, curr) => {
						if (curr.reaction) {
							return acc + 1;
						} else {
							return acc - 1;
						}
					}, 0);
				} else if (!data || error) {
					console.error(data, error);
				}
			});
	}

	const upvote = async () => {
		if (voted) {
			if (!upvoted) {
				await supabase
					.from("post_reactions")
					.update({ reaction: true })
					.eq("post_id", post.id)
					.eq("user_id", session.user.id);
                value += 2;
			} else {
				await supabase.from("post_reactions").delete().eq("post_id", post.id).eq("user_id", session.user.id);
				voted = false;
                value --;
			}
		} else {
			await supabase.from("post_reactions").insert({ post_id: post.id, user_id: session.user.id, reaction: true });
			voted = true;
            value ++;
		}

		upvoted = true;
	};

	const downvote = async () => {
		if (voted) {
			if (upvoted) {
				await supabase
					.from("post_reactions")
					.update({ reaction: false })
					.eq("post_id", post.id)
					.eq("user_id", session.user.id);
                value -= 2;
			} else {
				await supabase.from("post_reactions").delete().eq("post_id", post.id).eq("user_id", session.user.id);
				voted = false;
                value ++;
			}
		} else {
			await supabase.from("post_reactions").insert({ post_id: post.id, user_id: session.user.id, reaction: false });
			voted = true;
            value --;
		}

		upvoted = false;
	};
</script>

<div class="w-11/12">
	<img src={post.image} alt="Dog" />
	<p>{value}</p>
	<button on:click={upvote} class="bg-blue-500 disabled:bg-gray-400 text-white font-bold py-2 px-4 rounded">
		Upvote
	</button>

	<button on:click={downvote} class="bg-red-500 disabled:bg-gray-400 text-white font-bold py-2 px-4 rounded">
		Downvote
	</button>
</div>
