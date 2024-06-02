<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import { ICONS } from '$lib/const/ui';
	import Icon from '@iconify/svelte';

	const features = [
		{
			icon: ICONS.LIGHTNING_FILLED,
			title: 'Lightning Fast',
			description:
				'The service is utilizes the power of in-memory storage to store and retrieve data in seconds. This leads to a lightning fast response time.'
		},
		{
			icon: ICONS.TIMER_FILLED,
			title: 'Super quick',
			description: 'It hardly takes a minute to create a new bin. Even less to secure it!'
		},
		{
			icon: ICONS.SERVER_FILLED,
			title: 'Simple REST API',
			description:
				'We offer super simple REST API to read/write data. No more complicated REST APIs!'
		},
		{
			icon: ICONS.BRAND.GITHUB,
			title: 'Open source',
			description:
				'The Service is fully open source on github. You can take a look at code if you think we are liers.'
		}
	];
</script>

<main>
	<!-- Hero Section -->
	<div class="hero-section">
		<h1 class="hero-title">Store JSON with Ease</h1>
		<h1
			class="hero-title bg-gradient-to-b from-brand to-brand/70 bg-clip-text text-transparent"
		>
			Access Anytime
		</h1>

		<div class="my-3" />
		<div class="hero-subtitle">
			<span
				>Quickly store and retrieve your data with ultra-fast responses, seamless
				integration, and robust scalability. Perfect for cloud config files and feature
				flags.</span
			>
		</div>

		<div class="my-5"></div>
		<div class="hero-action">
			<Button size="lg">Try out!</Button>
			<Button size="lg" variant="brand" class="gap-2">
				<span>Get Started</span>
				<Icon icon={ICONS.ARROW_RIGHT} />
			</Button>
		</div>
	</div>

	<!--  features section -->
	<div class="features-section">
		<h1 class="heading">Why?</h1>

		<div class="my-8" />
		<div class="feature-grid">
			{#each features as feature}
				<div class="feature-item">
					<div class="icon-wrapper"><Icon font-size={30} icon={feature.icon} /></div>
					<div class="content-wrapper">
						<h2 class="title">{feature.title}</h2>
						<p class="description">{feature.description}</p>
					</div>
				</div>
			{/each}
		</div>
	</div>
</main>

<style scoped>
	main {
		width: 100%;
		min-height: fit-content;
	}

	main .hero-section {
		--section-y-padding: clamp(theme('padding.40'), theme('padding.56'), theme('padding.64'));

		width: 100%;
		height: fit-content;

		display: flex;
		flex-direction: column;
		align-items: center;
		padding: var(--section-y-padding) 0;

		& .hero-title {
			font-size: theme('fontSize.6xl');
			letter-spacing: theme('letterSpacing.tight');
			font-weight: theme('fontWeight.semibold');
			line-height: theme('lineHeight.tight');
		}

		& .hero-subtitle {
			font-size: theme('fontSize.lg');
			letter-spacing: theme('letterSpacing.tight');
			font-weight: theme('fontWeight.medium');
			text-align: center;

			max-width: 60ch;
		}

		& .hero-action {
			display: flex;
		}
	}

	main .features-section {
		--section-x-padding: clamp(theme('padding.20'), theme('padding.20'), theme('padding.40'));
		--section-y-padding: clamp(theme('padding.10'), theme('padding.16'), theme('padding.40'));

		width: 100%;
		height: fit-content;

		background-color: theme('backgroundColor.primary.DEFAULT');
		color: theme('colors.primary.foreground');

		display: flex;
		flex-direction: column;
		align-items: center;
		padding: var(--section-y-padding) var(--section-x-padding);

		& .heading {
			font-size: theme('fontSize.4xl');
			font-weight: theme('fontWeight.bold');
		}

		& .feature-grid {
			width: calc(max(fit-content, 50%) * 1px);

			display: grid;
			gap: theme('gap.8');
			grid-template-columns: repeat(auto-fill, minmax(400px, 1fr));

			& > .feature-item {
				display: flex;
				gap: theme('gap.4');

				& .icon-wrapper {
					@apply mt-1;
					width: fit-content;
					height: 100%;
					line-height: theme('lineHeight.3');
					color: theme('colors.brand.DEFAULT');
					filter: brightness(theme('brightness.125'));
				}

				& .content-wrapper {
					display: flex;
					flex-direction: column;
					gap: theme('gap.2');

					& .title {
						font-size: theme('fontSize.2xl');
						font-weight: theme('fontWeight.bold');
					}
				}
			}
		}
	}
</style>
