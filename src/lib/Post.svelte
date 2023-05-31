<script lang="ts">
	import type { SupabaseClient } from "@supabase/supabase-js";
	import type { Database } from "./database.types";

	export let supabase: SupabaseClient<Database>;
	export let post: Database["public"]["Tables"]["posts"]["Row"];
	export let status: "current" | "done" | "waiting" = "waiting";

	let value = 0;

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
</script>

<div
	class="card rounded-3xl bg-sky-100"
	data-dragging="false"
	data-status={status}
>
	<h2 class="pt-2 text-center text-4xl text-[#404b55] font-bold">{value}</h2>
	<img src={post.image} alt="Dog" class="h-[60vh] w-full aspect-[9/16] object-cover p-2 rounded-3xl" />
</div>
