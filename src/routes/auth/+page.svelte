<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import type { AuthProvider } from '$lib/types/auth';
	import { ICONS } from '$lib/const/ui';
	import { useAuth } from '$lib/use/auth';
	import Icon from '@iconify/svelte';
</script>

{#snippet AuthButton(icon: string, provider: AuthProvider)}
	<Button href={useAuth.getAuthorizationURL(provider).href} class="gap-2" size="lg">
		<Icon font-size={23} {icon} />
		<span>
			Continue with <span class="capitalize">{provider}</span>
		</span>
	</Button>
{/snippet}

<div class="wrapper">
	<div class="list">
		{@render AuthButton(ICONS.BRAND.GOOGLE, 'google')}
		{@render AuthButton(ICONS.BRAND.GITHUB, 'github')}
	</div>
</div>

<style>
	.wrapper {
		width: 100%;
		min-height: 100%;

		display: flex;
		justify-content: center;
		align-items: center;
		flex-direction: column;

		.list {
			@apply border;

			display: flex;
			flex-direction: column;

			background-color: theme('backgroundColor.accent.DEFAULT');

			gap: theme('gap.5');
			padding: theme('padding.5');
			border-radius: theme('borderRadius.DEFAULT');
		}
	}
</style>
