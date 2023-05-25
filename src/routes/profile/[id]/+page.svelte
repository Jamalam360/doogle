<script lang="ts">
	import Post from "$lib/Post.svelte";
	import type { PageData } from "./$types";

	export let data: PageData;
</script>

<p>Logged in as {data.user.email}</p>
<img src={data.user.user_metadata.avatar_url} alt="avatar" />

<br />

{#each data.posts || [] as post}
{/each}
