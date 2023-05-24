<script lang="ts">
	import "../app.css";
	import { invalidate } from "$app/navigation";
	import { onMount } from "svelte";

	export let data;

	$: ({ supabase, session } = data);

	onMount(() => {
		const { data } = supabase.auth.onAuthStateChange((event, _session) => {
			if (_session?.expires_at !== session?.expires_at) {
				invalidate("supabase:auth");
			}
		});

		return () => data.subscription.unsubscribe();
	});
</script>

<main class="min-h-screen bg-gray-50 text-gray-950">
	<nav class="h-20 flex items-center justify-center bg-gray-100">
		<a href="/">
			<img src="/logo.png" alt="Doogle Logo" class="h-24" />
		</a>
	</nav>

	<slot />
</main>
