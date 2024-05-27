import { browser } from '$app/environment';
import { AUTH_PROVIDER_ROUTES, NEXT_REDIRECT_SEARCH_PARAMETER_NAME } from '$lib/const/auth';
import { ROUTES } from '$lib/const/routes';

export function signIn(
	provider: keyof typeof AUTH_PROVIDER_ROUTES,
	options?: {
		redirectTo?: string;
	}
) {
	if (!browser) return;

	const url = AUTH_PROVIDER_ROUTES[provider];

	if (options?.redirectTo) {
		url.searchParams.set(NEXT_REDIRECT_SEARCH_PARAMETER_NAME, options.redirectTo);
	}

	location.href = url.href;
}

export function signOut(redirectTo?: string) {
	if (!browser) return;

	const url = ROUTES.AUTH_LOGOUT.url;
	if (redirectTo) {
		url.searchParams.set('redirectTo', redirectTo);
	}

	location.href = url.href;
}

export const useAuth = {
	signIn,
	signOut
};
