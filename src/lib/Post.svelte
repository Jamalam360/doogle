<script lang="ts">
	import BlurhashImage from "svelte-blurhash/src/BlurhashImage.svelte";
	import type { SupabaseClient } from "@supabase/supabase-js";
	import type { Database } from "./database.types";

	export let supabase: SupabaseClient<Database>;
	export let post: Database["public"]["Tables"]["posts"]["Row"];
	export let status: "current" | "done" | "waiting" = "waiting";

	let profile =
		post.user_id == null ? null : supabase.from("profiles").select("*").eq("id", post.user_id).limit(1).single();
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

	$: {
	}
</script>

<div class="card rounded-3xl bg-sky-100" data-dragging="false" data-status={status}>
	<div class="flex items-center space-x-4">
		{#if profile}
			{#await profile then { data: profile }}
				{#if profile}
					<a href={`/profile/${profile.id}`}
						><img src={profile.avatar} alt="avatar" class="h-10 w-10 rounded-full border border-ole" /></a
					>
					<a href={`/profile/${profile.id}`}><h2 class="text-2xl font-bold">{profile.username.split("#")[0]}</h2> </a>
				{/if}
			{/await}
		{:else}
			<img src="/system.jpg" alt="avatar" class="h-10 w-10 rounded-full border border-ole" />
			<h2 class="text-2xl font-bold">System</h2>
		{/if}
		<!-- Share button here -->
	</div>
	<BlurhashImage hash={post.blurhash_placeholder} src={post.image} alt="Dog" width="100%" height="100%" />
	<h2 class="pt-2 text-center text-4xl font-bold">{value}</h2>
</div>
