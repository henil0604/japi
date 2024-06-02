<script lang="ts">
	import { Button } from '$components/ui/button';
	import { ROUTES } from '$lib/const/routes';
	import { GITHUB_REPO_URL } from '$lib/const/social';
	import { ICONS } from '$lib/const/ui';
	import Icon from '@iconify/svelte';

	interface Link {
		name: string;
		href: string;
	}

	let links: Link[] = [];
</script>

<div class="navbar-wrapper">
	<div class="navbar">
		<div class="head">
			<div class="title">JAPI</div>
		</div>
		<div class="body">
			{#each links as link}
				<Button href={link.href} variant="link" class="link">
					{link.name}
				</Button>
			{/each}
		</div>
		<div class="tail">
			<a target="_blank" title="Open Github repo" href={GITHUB_REPO_URL}>
				<Icon font-size={30} icon={ICONS.BRAND.GITHUB} />
			</a>
			<Button href={ROUTES.AUTH_BASE.url.href} variant="brand-outline" size="sm"
				>Sign In</Button
			>
		</div>
	</div>
</div>

<style>
	.navbar-wrapper {
		display: flex;
		justify-content: center;
		align-items: center;
		@apply container;

		padding: theme('padding.4') theme('padding.8');
		@apply border-b;
	}

	.navbar {
		width: 100%;

		display: flex;
		align-items: center;
		gap: theme('gap.8');

		& .head .title {
			font-size: theme('fontSize.2xl');
			font-weight: theme('fontWeight.bold');
		}

		& .body {
			flex-grow: 1;
		}

		& .tail {
			display: flex;
			align-items: center;
			gap: theme('gap.5');
		}
	}
</style>
