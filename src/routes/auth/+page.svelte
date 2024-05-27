<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import { ICONS } from '$lib/const/ui';
	import { useAuth } from '$lib/use/auth';
	import Icon from '@iconify/svelte';
</script>

<div class="wrapper">
	<Button class="gap-2" size="lg" on:click={() => useAuth.signIn('github')}>
		<Icon font-size={23} icon={ICONS.BRAND.GITHUB} />
		Continue with Github</Button
	>
	<Button class="gap-2" size="lg" on:click={() => useAuth.signIn('google')}>
		<Icon font-size={23} icon={ICONS.BRAND.GOOGLE} />
		Continue with Google</Button
	>
</div>

<style>
	:global {
		html,
		body {
			height: 100%;
		}

		body {
			display: flex;
			justify-content: center;
			align-items: center;
		}
	}

	.wrapper {
		@apply border;
		display: flex;
		flex-direction: column;

		background-color: theme('backgroundColor.accent.DEFAULT');

		gap: theme('gap.5');
		padding: theme('padding.5');
		border-radius: theme('borderRadius.DEFAULT');
	}
</style>
