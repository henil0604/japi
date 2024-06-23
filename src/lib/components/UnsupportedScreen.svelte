<script lang="ts">
	import { cn } from '$lib/utils/shadcn';

	let className = '';
	export { className as class };
</script>

<div class={cn('wrapper', className)}>
	<span class="sorry-message">We are Sorry!</span>

	<span class="main-message">The screen is unsupported.</span>
	<span class="description"
		>Please use larger screen to view this page while we develop the page.</span
	>

	<!-- TODO: add learn more page link -->
</div>

<style>
	.wrapper {
		width: 100%;
		height: 100%;

		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		padding: 0 theme('padding.8');

		& span {
			text-align: center;
		}

		& .sorry-message {
			font-size: theme('fontSize.3xl');
			line-height: theme('lineHeight.loose');
		}

		& .main-message {
			font-size: theme('fontSize.xl');
		}

		& .main-message,
		.sorry-message {
			font-weight: theme('fontWeight.bold');
		}

		& .description {
		}
	}
</style>
