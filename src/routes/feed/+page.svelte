<script lang="ts">
	import Post from "$lib/Post.svelte";
	import type { Database } from "$lib/database.types.js";

	export let data;
</script>

<p>Logged in as {data.user.email}</p>
<img src={data.user.user_metadata.avatar_url} alt="avatar" />

<br />

{#each data.posts as post}
	<Post {post} supabase={data.supabase} session={data.session} />
{/each}
