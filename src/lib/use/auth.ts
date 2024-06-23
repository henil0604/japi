import { browser } from '$app/environment';
import { goto } from '$app/navigation';
import { page } from '$app/stores';
import { AUTH_PROVIDER_ROUTES, NEXT_REDIRECT_SEARCH_PARAMETER_NAME } from '$lib/const/auth';
import { ROUTES } from '$lib/const/routes';
import type { AuthProvider } from '$lib/types/auth';
import { get } from 'svelte/store';

interface AuthorizationURLOptions {
	redirectTo?: string;
}
export function getAuthorizationURL(
	provider?: AuthProvider | null,
	options?: AuthorizationURLOptions
) {
	const url = provider ? AUTH_PROVIDER_ROUTES[provider] : ROUTES.AUTH_BASE.url;

	if (options?.redirectTo) {
		url.searchParams.set(NEXT_REDIRECT_SEARCH_PARAMETER_NAME, options.redirectTo);
	}

	return url;
}

export function signIn(...args: Parameters<typeof getAuthorizationURL>) {
	const url = getAuthorizationURL(...args);

	goto(url);
}

export function signOut(redirectTo?: string) {
	const url = ROUTES.AUTH_LOGOUT.url;

	if (redirectTo) {
		url.searchParams.set(NEXT_REDIRECT_SEARCH_PARAMETER_NAME, redirectTo);
	}

	goto(url);
}

export function isAuthenticated() {
	if (!browser) return false;

	return Boolean(get(page).data.session && get(page).data.user);
}

export const useAuth = {
	getAuthorizationURL,
	signIn,
	signOut,
	isAuthenticated
};
