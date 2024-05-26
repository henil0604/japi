import {
	GOOGLE_OAUTH_CODE_COOKIE_NAME,
	GOOGLE_OAUTH_STATE_COOKIE_NAME,
	GOOGLE_PROVIDER_ID,
	GOOGLE_SCOPES
} from '$lib/const/auth';
import { google } from '$lib/server/auth';
import type { Cookies } from '@sveltejs/kit';
import * as arctic from 'arctic';
import { authService } from '.';
export async function initializeAuthenticationProcess() {
	const state = arctic.generateState();
	const codeVerifier = arctic.generateCodeVerifier();

	const url = await google.createAuthorizationURL(state, codeVerifier, {
		scopes: GOOGLE_SCOPES
	});

	return {
		state,
		codeVerifier,
		url
	};
}

export function validateCallbackCookies(cookies: Cookies, url: URL, deleteCookiesAfter = false) {
	const storedState = cookies.get(GOOGLE_OAUTH_STATE_COOKIE_NAME) ?? null;
	const codeVerifier = cookies.get(GOOGLE_OAUTH_CODE_COOKIE_NAME) ?? null;

	const state = url.searchParams.get('state');
	const code = url.searchParams.get('code');

	// verify state
	if (!state || !storedState || !code || storedState !== state || !codeVerifier) {
		return {
			valid: false as const,
			state: null,
			code: null,
			codeVerifier: null
		};
	}

	if (deleteCookiesAfter) {
		authService.deleteCookie(cookies, GOOGLE_OAUTH_STATE_COOKIE_NAME);
		authService.deleteCookie(cookies, GOOGLE_OAUTH_CODE_COOKIE_NAME);
	}

	return {
		valid: true as const,
		state,
		code,
		codeVerifier
	};
}

// user object coming from google api
export interface GoogleUser {
	sub: string;
	name: string;
	email: string;
	picture: string;
}
export async function fetchGoogleUserFromAPI(accessToken: string) {
	const response = await fetch('https://openidconnect.googleapis.com/v1/userinfo', {
		headers: {
			Authorization: `Bearer ${accessToken}`
		}
	});
	const googleUser: GoogleUser = await response.json();

	return googleUser;
}
