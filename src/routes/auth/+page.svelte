<script lang="ts">
	import { ICONS } from '$lib/const/ui';
	import AuthButton from '$lib/components/AuthButton.svelte';
</script>

<div class="wrapper">
	<div class="list">
		<AuthButton icon={ICONS.BRAND.GOOGLE} provider="google" />
		<AuthButton icon={ICONS.BRAND.GITHUB} provider="github" />
	</div>
</div>

<style lang="css">
	.wrapper {
		width: 100%;
		min-height: 100%;

		display: flex;
		justify-content: center;
		align-items: center;
		flex-direction: column;

		& .list {
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
