<script lang="ts">
	import type { AuthProvider } from '$lib/types/auth';
	import { Button } from '$components/ui/button';
	import { useAuth } from '$lib/use/auth';
	import Icon from '@iconify/svelte';

	export let icon: string;
	export let provider: AuthProvider;
</script>

<Button href={useAuth.getAuthorizationURL(provider).href} class="gap-2" size="lg">
	<Icon font-size={23} {icon} />
	<span>
		Continue with <span class="capitalize">{provider}</span>
	</span>
</Button>
