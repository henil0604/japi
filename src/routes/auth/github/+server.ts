import { generateState } from 'arctic';
import type { RequestHandler } from './$types';
import { github } from '$lib/server/auth';
import { GITHUB_OAUTH_STATE_COOKIE_NAME } from '$lib/const/auth';
import { NODE_ENV } from '$env/static/private';
import { redirect } from '@sveltejs/kit';

export const GET: RequestHandler = async (event) => {
	const { cookies } = event;

	const state = generateState();
	const url = await github.createAuthorizationURL(state, {
		scopes: ['user:email']
	});

	cookies.set(GITHUB_OAUTH_STATE_COOKIE_NAME, state, {
		httpOnly: true,
		secure: NODE_ENV === 'production',
		path: '/',
		maxAge: 60 * 10, // 10 minutes
		sameSite: 'lax'
	});

	throw redirect(301, url.href);
};
