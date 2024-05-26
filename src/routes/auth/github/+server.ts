import type { RequestHandler } from './$types';
import { GITHUB_OAUTH_STATE_COOKIE_NAME } from '$lib/const/auth';
import { redirect } from '@sveltejs/kit';
import { authService } from '$lib/server/services/auth';

export const GET: RequestHandler = async (event) => {
	const { cookies, setHeaders } = event;

	// TODO: invalidate current session if it exists

	const { state, url } = await authService.github.initializeAuthenticationProcess();

	cookies.set(GITHUB_OAUTH_STATE_COOKIE_NAME, state, authService.generateCookieSetOptions());

	// disable cache
	setHeaders({
		'Cache-Control': 'no-cache'
	});
	throw redirect(301, url.href);
};
