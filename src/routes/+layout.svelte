<script>
	import DefaultLayout from '$layouts/default.svelte';
	import '$lib/styles/global.css';

	const { children } = $props();
</script>

<DefaultLayout {children} />

<style></style>
