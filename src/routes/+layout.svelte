<script lang="ts">
	import "../app.css";
	import { invalidate } from "$app/navigation";
	import { onMount } from "svelte";
	import type { LayoutData } from "./$types";

	export let data: LayoutData;

	$: ({ supabase, session } = data);

	onMount(() => {
		const { data } = supabase.auth.onAuthStateChange((_, session) => {
			if (session?.expires_at !== session?.expires_at) {
				invalidate("supabase:auth");
			}
		});

		return () => data.subscription.unsubscribe();
	});	
</script>

<main class="h-screen bg-gray-50 text-gray-950">
	<nav class="h-20 flex items-center justify-between px-4 mb-4 bg-gray-100">
		<a href="/">
			<img src="/logo.png" alt="Doogle Logo" class="h-16" />
		</a>

		{#if session}
			<a href={`/profile/${session.user.id}`}>
				<img src={session.user.user_metadata.avatar_url} alt="avatar" class="h-14 rounded-full" />
			</a>
		{:else if data.path !== "/login"}
			<a href="/login" class="text-2xl font-bold text-gray-950 hover:text-gray-900"> Login </a>
		{/if}
	</nav>

	<slot />
</main>
