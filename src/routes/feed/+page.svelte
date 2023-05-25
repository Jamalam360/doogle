<script lang="ts">
	import Post from "$lib/Post.svelte";
	import type { PageData } from "./$types";

	export let data: PageData;
	let posts = data.posts;
</script>

<p>Logged in as {data.user.email}</p>
<img src={data.user.user_metadata.avatar_url} alt="avatar" />

<br />
<!-- 
<Post
	supabase={data.supabase}
	session={data.session}
	post={{
		approved: true,
		created_at: "2021-08-18T20:00:00.000Z",
		id: 5420,
		image: "https://via.placeholder.com/900x1600",
		user_id: "540f09ab-de3b-4851-9dbe-1a4ce93a768a",
	}}
	onVoted={() => {
		
	}}
/> -->

<br />

{#each posts as post}
	{#key post.id}
		<Post
			{post}
			supabase={data.supabase}
			session={data.session}
			onVoted={() => {
				posts = [...posts.splice(1)];
			}}
		/>
	{/key}
{/each}
