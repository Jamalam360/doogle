<script lang="ts">
	import { browser } from "$app/environment";
	import { goto } from "$app/navigation";
	import type { PageData } from "./$types";

	export let data: PageData;
	const session = data.session;

	console.log(session);
	if (browser && !session) {
		goto("/login");
	} else if (browser && session) {
		data.supabase
			.from("profiles")
			.insert({
				id: session.user.id,
				avatar: session.user.user_metadata.avatar_url,
				username: session.user.user_metadata.name,
			})
			.then((res) => {
				if (res.error) {
					console.error(res.error);
					goto("/login");
				} else {
					goto("/feed");
				}
			});
	}
</script>
