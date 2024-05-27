import { NODE_ENV } from '$env/static/private';
import type { Cookies } from '@sveltejs/kit';
import { githubAuthService } from './github';
import { googleAuthService } from './google';
import { Cookie, generateIdFromEntropySize, type RegisteredDatabaseSessionAttributes } from 'lucia';
import {
	AUTH_USER_ID_ENTROPY_SIZE,
	NEXT_REDIRECT_SEARCH_PARAMETER_NAME,
	PROTECTED_ROUTES
} from '$lib/const/auth';
import { lucia } from '$lib/server/auth';
import outmatch from 'outmatch';

interface CookieSetOptions {
	path: string;
	secure: boolean;
	httpOnly: boolean;
	maxAge: number;
	sameSite: 'lax';
}
export function generateCookieSetOptions(path = '/'): CookieSetOptions {
	return {
		httpOnly: true,
		path: path,
		maxAge: 10 * 60,
		sameSite: 'lax',
		secure: NODE_ENV === 'production'
	};
}

export function deleteCookie(cookies: Cookies, name: string) {
	return cookies.delete(name, {
		path: '/'
	});
}

export function generateUserId(size: number = AUTH_USER_ID_ENTROPY_SIZE) {
	return generateIdFromEntropySize(size);
}

export async function createSessionCookie(
	userId: string,
	attributes: RegisteredDatabaseSessionAttributes
) {
	// create session
	const session = await lucia.createSession(userId, attributes);
	// create cookie from session
	const sessionCookie = lucia.createSessionCookie(session.id);

	return {
		session,
		cookie: sessionCookie
	};
}

export function setSessionCookie(
	cookies: Cookies,
	cookie: Cookie,
	attributes?: Partial<CookieSetOptions>
) {
	// set cookie
	return cookies.set(cookie.name, cookie.value, {
		path: '.',
		...cookie.attributes,
		...(attributes || {})
	});
}

export async function createAndSetSessionCookie(
	userId: string,
	providerId: string,
	cookies: Cookies
) {
	const { cookie: sessionCookie } = await authService.createSessionCookie(userId, {
		providerId: providerId
	});
	authService.setSessionCookie(cookies, sessionCookie);
	return {
		cookie: sessionCookie
	};
}

export function isProtectedRoute(pathname: string, routes = PROTECTED_ROUTES) {
	return routes.some((path) => {
		return outmatch(path)(pathname);
	});
}

export async function logoutSession(sessionId: string) {
	await lucia.invalidateSession(sessionId);

	const blankSession = lucia.createBlankSessionCookie();

	return {
		cookie: blankSession
	};
}

export function getRedirectPathnameFromCookie(cookies: Cookies, deleteAfter = true) {
	const redirectToPathname = cookies.get(NEXT_REDIRECT_SEARCH_PARAMETER_NAME) ?? '/';
	if (deleteAfter) {
		authService.deleteCookie(cookies, NEXT_REDIRECT_SEARCH_PARAMETER_NAME);
	}
	return redirectToPathname;
}

export const authService = {
	generateCookieSetOptions,
	deleteCookie,
	generateUserId,
	createSessionCookie,
	setSessionCookie,
	createAndSetSessionCookie,
	isProtectedRoute,
	logoutSession,
	getRedirectPathnameFromCookie,
	google: googleAuthService,
	github: githubAuthService
};
