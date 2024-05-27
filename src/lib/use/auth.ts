import { goto } from '$app/navigation';
import { AUTH_PROVIDER_ROUTES, NEXT_REDIRECT_SEARCH_PARAMETER_NAME } from '$lib/const/auth';
import { ROUTES } from '$lib/const/routes';
import type { AuthProvider } from '$lib/types/auth';

interface AuthorizationURLOptions {
	redirectTo?: string;
}
export function getAuthorizationURL(provider: AuthProvider, options?: AuthorizationURLOptions) {
	const url = AUTH_PROVIDER_ROUTES[provider];

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

export const useAuth = {
	getAuthorizationURL,
	signIn,
	signOut
};
