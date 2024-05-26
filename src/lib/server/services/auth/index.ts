import { NODE_ENV } from '$env/static/private';
import type { Cookies } from '@sveltejs/kit';
import * as githubService from './github';
import * as googleService from './google';
import { Cookie, generateIdFromEntropySize, type RegisteredDatabaseSessionAttributes } from 'lucia';
import { AUTH_USER_ID_ENTROPY_SIZE } from '$lib/const/auth';
import { lucia } from '$lib/server/auth';

interface CookieSetOptions {
	path: string;
	secure: boolean;
	httpOnly: boolean;
	maxAge: number;
	sameSite: 'lax';
}
function generateCookieSetOptions(path = '/'): CookieSetOptions {
	return {
		httpOnly: true,
		path: path,
		maxAge: 10 * 60,
		sameSite: 'lax',
		secure: NODE_ENV === 'production'
	};
}

function deleteCookie(cookies: Cookies, name: string) {
	return cookies.delete(name, {
		path: '/'
	});
}

function generateUserId(size: number = AUTH_USER_ID_ENTROPY_SIZE) {
	return generateIdFromEntropySize(size);
}

async function createSessionCookie(
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

function setSessionCookie(
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

async function createAndSetSessionCookie(userId: string, providerId: string, cookies: Cookies) {
	const { cookie: sessionCookie } = await authService.createSessionCookie(userId, {
		providerId: providerId
	});
	authService.setSessionCookie(cookies, sessionCookie);
	return {
		cookie: sessionCookie
	};
}

export const authService = {
	generateCookieSetOptions,
	deleteCookie,
	generateUserId,
	createSessionCookie,
	setSessionCookie,
	createAndSetSessionCookie,
	github: githubService,
	google: googleService
};
