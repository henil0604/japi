<script lang="ts">
	import { isTabletViewport } from '$stores/utils';
	import UnsupportedScreen from '$components/UnsupportedScreen.svelte';
</script>

<div>
	{#if $isTabletViewport}
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
