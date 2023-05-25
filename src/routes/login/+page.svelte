<script lang="ts">
	import { Auth } from '@supabase/auth-ui-svelte';
	import { ThemeSupa } from '@supabase/auth-ui-shared';

	export let data;
</script>

<Auth
	supabaseClient={data.supabase}
	providers={['discord']}
    onlyThirdPartyProviders={true}
	redirectTo={`${data.url}/logging-in`}
	appearance={{ theme: ThemeSupa, style: {} }}
	additionalData={{}}
/>
