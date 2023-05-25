<script lang="ts">
	import { Auth } from "@supabase/auth-ui-svelte";
	import { ThemeSupa } from "@supabase/auth-ui-shared";

	export let data;
</script>

<div class="w-full flex flex-col items-center">
	<Auth
		supabaseClient={data.supabase}
		providers={["discord"]}
		onlyThirdPartyProviders={true}
		redirectTo={`${data.url}/logging-in`}
		appearance={{ theme: ThemeSupa, style: { container: "width: 80vw;" } }}
		additionalData={{}}
	/>
	<div class="h-[1px] w-4/5 rounded-full bg-gray-300" />
	<p class="pt-2 font-light">More sign in options coming soon.</p>
</div>
