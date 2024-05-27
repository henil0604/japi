<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import { NEXT_REDIRECT_SEARCH_PARAMETER_NAME } from '$lib/const/auth';
	import { ROUTES } from '$lib/const/routes';

	function handleLogin(provider: string) {
		let baseRoute = ROUTES.AUTH_GOOGLE.url;

		switch (provider) {
			case 'github':
				baseRoute = ROUTES.AUTH_GITHUB.url;
				break;

			case 'google':
				baseRoute = ROUTES.AUTH_GOOGLE.url;
				break;

			default:
				baseRoute = ROUTES.AUTH_GOOGLE.url;
		}

		const redirectTo = $page.url.searchParams.get(NEXT_REDIRECT_SEARCH_PARAMETER_NAME);
		if (redirectTo) {
			baseRoute.searchParams.set(NEXT_REDIRECT_SEARCH_PARAMETER_NAME, redirectTo);
		}

		goto(baseRoute);
	}
</script>

<button onclick={() => handleLogin('google')}>Continue with Google</button>
<button onclick={() => handleLogin('github')}>Continue with Github</button>

<style>
	:global {
		html,
		body {
			height: 100%;
		}

		body {
			display: flex;
			flex-direction: column;
			justify-content: center;
			align-items: center;
			gap: 10px;

			button {
				border: 1px solid #999;
				padding: 10px 15px;
				border-radius: 5px;
				transition: 0.3s all;

				&:hover {
					background-color: #000;
					color: #fff;
				}
			}
		}
	}
</style>
