import { GITHUB_OAUTH_STATE_COOKIE_NAME, GITHUB_PROVIDER_ID, GITHUB_SCOPES } from '$lib/const/auth';
import { github } from '$lib/server/auth';
import { type Cookies } from '@sveltejs/kit';
import * as arctic from 'arctic';
import { authService } from '.';

export async function initializeAuthenticationProcess() {
	const state = arctic.generateState();

	const url = await github.createAuthorizationURL(state, {
		scopes: GITHUB_SCOPES
	});

	return {
		state,
		url
	};
}

export function validateCallbackCookies(cookies: Cookies, url: URL, deleteCookiesAfter = false) {
	const storedState = cookies.get(GITHUB_OAUTH_STATE_COOKIE_NAME) ?? null;

	const code = url.searchParams.get('code');
	const state = url.searchParams.get('state');

	if (!code || !state || !storedState || state !== storedState) {
		return {
			valid: false as const,
			code: null,
			state: null
		};
	}

	if (deleteCookiesAfter) {
		authService.deleteCookie(cookies, GITHUB_OAUTH_STATE_COOKIE_NAME);
	}

	return {
		valid: true as const,
		code,
		state
	};
}

// user object coming from github api
export interface GithubUser {
	id: number;
	login: string;
	avatar_url?: string;
	name: string;
	// extra also come but we don't need
}
export async function fetchGithubUserFromAPI(accessToken: string) {
	// make fetch request to github API
	const githubUserResponse = await fetch('https://api.github.com/user', {
		headers: {
			Authorization: `Bearer ${accessToken}`
		}
	});
	// convert to json
	const githubUser: GithubUser = await githubUserResponse.json();

	return githubUser;
}

export interface GithubEmail {
	email: string;
	primary: boolean;
	visibility: string | null;
	verified: boolean;
}
export async function fetchUserPrimaryEmailFromAPI(accessToken: string) {
	// make fetch request to github API
	const githubUserEmailsResponse = await fetch('https://api.github.com/user/emails', {
		headers: {
			Authorization: `Bearer ${accessToken}`
		}
	});

	// convert to json
	const emails: GithubEmail[] = await githubUserEmailsResponse.json();

	// find the email that is either ( verified & primary ) or ( verified )
	const primaryEmail = emails.find((email) => email.primary && email.verified)?.email ?? null;

	return primaryEmail;
}

export const githubAuthService = {
	initializeAuthenticationProcess,
	validateCallbackCookies,
	fetchGithubUserFromAPI,
	fetchUserPrimaryEmailFromAPI
};
