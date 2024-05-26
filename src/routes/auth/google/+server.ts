import type { RequestHandler } from './$types';
import { GOOGLE_OAUTH_STATE_COOKIE_NAME, GOOGLE_OAUTH_CODE_COOKIE_NAME } from '$lib/const/auth';
import { redirect } from '@sveltejs/kit';
import { authService } from '$lib/server/services/auth';

export const GET: RequestHandler = async (event) => {
	const { cookies, setHeaders } = event;

	const { codeVerifier, state, url } = await authService.google.initializeAuthenticationProcess();

	cookies.set(GOOGLE_OAUTH_STATE_COOKIE_NAME, state, authService.generateCookieSetOptions());

	cookies.set(
		GOOGLE_OAUTH_CODE_COOKIE_NAME,
		codeVerifier,
		authService.generateCookieSetOptions()
	);

	// disable cache
	setHeaders({
		'Cache-Control': 'no-cache'
	});

	throw redirect(301, url.href);
};
