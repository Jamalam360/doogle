<script lang="ts">
	import ReviewPost from "$lib/ReviewPost.svelte";
	import type { Database } from "$lib/database.types.js";

	export let data;

	let unapprovedPosts: Database["public"]["Tables"]["posts"]["Row"][] = [];

	data.supabase
		.from("posts")
		.select("*")
		.eq("approved", false)
		.order("created_at", { ascending: false })
		.then((res) => {
			let { data, error } = res;
			if (data) {
				unapprovedPosts = data;
			} else if (error) {
				console.error(error);
			}
		});

	const onChange = () => {
		data.supabase
			.from("posts")
			.select("*")
			.eq("approved", false)
			.order("created_at", { ascending: false })
			.then((res) => {
				let { data, error } = res;
				if (data) {
					unapprovedPosts = data;
				} else if (error) {
					console.error(error);
				}
			});
	};
</script>

<h1>Admin Page</h1>

{#each unapprovedPosts as post}
	<ReviewPost supabase={data.supabase} {post} {onChange} />
{/each}
