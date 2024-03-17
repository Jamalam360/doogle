<script lang="ts">
	import { Auth } from "@supabase/auth-ui-svelte";
	import { ThemeSupa } from "@supabase/auth-ui-shared";

	export let data;
</script>

<div class="flex flex-col items-center max-w-sm mx-auto">
	<Auth
		supabaseClient={data.supabase}
		providers={["discord"]}
		onlyThirdPartyProviders={true}
		redirectTo={`${data.url}/logging-in`}
		appearance={{ theme: ThemeSupa, style: { container: "width: 100%;"} }}
		additionalData={{}}
	/>
	<div class="h-[1px] w-full rounded-full bg-gray-300" />
	<p class="pt-2 font-light">More sign in options coming soon.</p>
</div>
