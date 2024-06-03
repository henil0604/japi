<script lang="ts">
	import LandingNavbar from '$lib/components/LandingNavbar.svelte';
	import { Button } from '$lib/components/ui/button';
	import { ICONS } from '$lib/const/ui';
	import Icon from '@iconify/svelte';
	import { JSONEditor, Mode, type Content } from 'svelte-jsoneditor';
	import { writable, type Writable } from 'svelte/store';

	const features = [
		{
			icon: ICONS.LIGHTNING_FILLED,
			title: 'Lightning Fast',
			description:
				'The service is utilizes the power of in-memory storage to store and retrieve data in milliseconds. This leads to a lightning fast response time.'
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

	const webEditorFeatures = [
		'Simple',
		'Syntax Highlighting',
		'Multi mode view',
		'Transformers',
		'Quick Search',
		'Formatting',
		'Regex Search Support',
		'Advance Search with Queries'
	];

	let tryoutEditorContent: Writable<Content> = writable({
		json: {
			what: 'Easy and simple JSON Bins',
			butWhy: [...features.map((feature) => feature.title)],
			freeTier: true
		}
	});

	let tryoutEditorRef: JSONEditor;

	// TODO: abstract this out
	$: isTryoutEditorValueInvalid =
		tryoutEditorRef && $tryoutEditorContent && tryoutEditorRef.validate() === null
			? false
			: true;

	let temporaryBinId = null;

	// TODO: abstract this out
	function getContent() {
		const content = tryoutEditorRef.get();

		let json = 'json' in content === false ? JSON.parse(content.text) : content.json;

		return {
			json,
			text: JSON.stringify(json, null, 4)
		};
	}

	function handleTryoutEditorSaveAction() {
		let content = getContent();

		// format the editor
		$tryoutEditorContent = {
			text: content.text
		};

		// TODO: implement logic
	}
</script>

<main>
	<LandingNavbar />

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
			<Button
				size="lg"
				on:click={() =>
					scrollTo({
						behavior: 'smooth',
						top: document.getElementById('try')?.offsetTop
					})}>Try out!</Button
			>
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

	<div id="try" class="tryout-section">
		<h1 class="heading">Try it out!</h1>

		<div class="my-8" />
		<div class="section">
			<div class="editor-wrapper">
				<JSONEditor
					bind:this={tryoutEditorRef}
					indentation={4}
					bind:content={$tryoutEditorContent}
					mode={Mode.tree}
				/>
				<div class="action-footer">
					<div class="action-info">
						{#if temporaryBinId}
							<div class="alert">
								This temporary bin will be deleted after 24 hours. <a href=""
									>Sign in to claim it
								</a>.
							</div>
							<a href="" target="_blank" class="link"
								>{location.origin}/api/{crypto.randomUUID()}</a
							>
						{:else}
							<div class="create-info">Create a temporary public bin</div>
						{/if}
					</div>
					<div class="action-button">
						<Button
							bind:disabled={isTryoutEditorValueInvalid}
							on:click={handleTryoutEditorSaveAction}
							>{temporaryBinId ? 'Save' : 'Create'}</Button
						>
					</div>
				</div>
			</div>
			<div class="info-wrapper">
				<div class="heading">Effortless Web Editing Experience</div>
				<div class="editor-features">
					{#each webEditorFeatures as feature}
						<div class="feature-item">
							<div class="icon-wrapper">
								<Icon font-size={30} icon={ICONS.CHECK_CIRCLE} />
							</div>
							<div class="text">
								{feature}
							</div>
						</div>
					{/each}
				</div>
			</div>
		</div>
	</div>

	<div class="footer">
		<div class="copyright-notice">
			Copyright &copy; JAPI | {new Date().getFullYear()}
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
			gap: theme('gap.4');
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

	main .tryout-section {
		--section-x-padding: clamp(theme('padding.20'), theme('padding.20'), theme('padding.40'));
		--section-y-padding: clamp(theme('padding.10'), theme('padding.16'), theme('padding.40'));

		width: 100%;
		height: fit-content;
		min-height: 80vh;

		display: flex;
		flex-direction: column;
		align-items: center;
		padding: var(--section-y-padding) var(--section-x-padding);
		padding-bottom: theme('padding.48');

		& .heading {
			font-size: theme('fontSize.4xl');
			font-weight: theme('fontWeight.bold');
		}

		& .section {
			width: 100%;
			height: 100%;
			flex-grow: 1;
			display: flex;
			gap: theme('gap.8');

			@media screen and (max-width: 1200px) {
				flex-direction: column;

				& .editor-wrapper,
				.info-wrapper {
					width: 100% !important;
				}
			}

			& .editor-wrapper {
				width: 50%;
				min-height: 100%;
				max-height: 70vh;

				& .action-footer {
					display: flex;
					padding: theme('padding.4') 0;
					justify-content: space-between;

					& .action-info {
						flex-grow: 1;
						display: flex;
						flex-direction: column;
						justify-content: center;
						gap: theme('gap.2');

						& a {
							text-decoration: underline;
							text-underline-offset: theme('textUnderlineOffset.4');
						}

						& .alert {
							font-size: theme('fontSize.sm');
							color: theme('colors.red.600');
							font-weight: theme('fontWeight.semibold');
						}

						& .link {
							color: theme('colors.brand.DEFAULT');
							filter: brightness(70%);
							font-size: theme('fontSize.base');
						}
					}

					& .action-button {
						flex-grow: 0;
						min-width: fit-content;
					}
				}
			}

			& .info-wrapper {
				width: 50%;
				display: flex;
				flex-direction: column;
				gap: theme('gap.4');

				& .heading {
					font-size: theme('fontSize.2xl');
					font-weight: theme('fontWeight.bold');
				}

				& .editor-features {
					display: grid;
					grid-template-columns: repeat(2, 1fr);
					gap: theme('gap.4');

					& .feature-item {
						display: flex;
						align-items: center;
						gap: theme('gap.2');

						& .icon-wrapper {
							color: theme('colors.brand.DEFAULT');
						}

						& .text {
							font-size: theme('fontSize.lg');
						}
					}
				}
			}
		}
	}

	main .footer {
		--section-x-padding: clamp(theme('padding.20'), theme('padding.20'), theme('padding.40'));
		--section-y-padding: clamp(theme('padding.10'), theme('padding.16'), theme('padding.40'));

		background-color: theme('backgroundColor.accent.DEFAULT');
		color: theme('colors.accent.foreground');

		width: 100%;
		height: 100%;

		padding: var(--section-y-padding) var(--section-x-padding);

		display: flex;
		flex-direction: column;
		gap: theme('gap.8');

		& .copyright-notice {
			text-align: center;
			font-weight: theme('fontWeight.semibold');
		}
	}
</style>
