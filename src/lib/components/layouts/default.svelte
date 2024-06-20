<script lang="ts">
	import { isTabletViewport } from '$stores/utils';
	import UnsupportedScreen from '$components/UnsupportedScreen.svelte';
	import { SUPPORTED_TABLET_ROUTES } from '$lib/const/ui';
	import { page } from '$app/stores';

	$: isTabletVideoSupported = SUPPORTED_TABLET_ROUTES.includes($page.url.pathname);
</script>

<div>
	{#if $isTabletViewport && isTabletVideoSupported === false}
		<UnsupportedScreen />
	{:else}
		<slot />
	{/if}
</div>

<style scoped>
	div {
		min-height: 100%;
		flex-grow: 1;
	}
</style>
