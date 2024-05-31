<script lang="ts">
	import type { Snippet } from 'svelte';

	const {
		children
	}: {
		children: Snippet;
	} = $props();
</script>

<div>
	{@render children()}
</div>

<style scoped>
	div {
		min-height: 100%;
		flex-grow: 1;
	}
</style>
