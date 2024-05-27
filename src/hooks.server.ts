import { sequence } from '@sveltejs/kit/hooks';
import { trpcHook } from '$lib/server/trpc/hook';
import { authHook } from '$lib/server/auth/hook';
import { redirect, type Handle } from '@sveltejs/kit';
import { authService } from '$lib/server/services/auth';
import { ROUTES } from '$lib/const/routes';
import { NEXT_REDIRECT_SEARCH_PARAMETER_NAME } from '$lib/const/auth';

const protectedRouteHook: Handle = ({ event, resolve }) => {
	const { url, locals } = event;

	const isProtectedRoute = authService.isProtectedRoute(url.pathname);

	if (!locals.session && !locals.user && isProtectedRoute === true) {
		const authURL = ROUTES.AUTH_BASE.url;
		authURL.searchParams.set(NEXT_REDIRECT_SEARCH_PARAMETER_NAME, url.pathname);
		throw redirect(307, authURL);
	}

	return resolve(event);
};

export const handle = sequence(authHook, trpcHook, protectedRouteHook);
