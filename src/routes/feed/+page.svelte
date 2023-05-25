<script lang="ts">
	import Post from "$lib/Post.svelte";
	import type { PageData } from "./$types";

	export let data: PageData;
	let posts = data.posts;
</script>

<div class="w-full flex items-center justify-center">
	{#each posts as post, i}
		{#key post.id}
			<Post
				{post}
				supabase={data.supabase}
				session={data.session}
				onTop={i == 0}
				onVoted={() => {
					posts = [...posts.splice(1)];
				}}
				index={posts.length - i}
			/>
		{/key}
	{/each}
</div>
