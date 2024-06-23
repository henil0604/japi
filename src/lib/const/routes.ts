import { browser } from '$app/environment';
import { PUBLIC_ORIGIN } from '$env/static/public';
import { transformObject } from '$lib/utils/transformObject';

const ORIGIN = browser
	? location.origin
	: process.env.VERCEL_URL
		? process.env.VERCEL_URL
		: PUBLIC_ORIGIN;

const RAW_ROUTES = {
	LANDING: '/',
	AUTH_BASE: '/auth',
	AUTH_GITHUB: '/auth/github',
	AUTH_GITHUB_CALLBACK: '/auth/github/callback',
	AUTH_GOOGLE: '/auth/google',
	AUTH_GOOGLE_CALLBACK: '/auth/google/callback',
	AUTH_LOGOUT: '/auth/logout',
	DASHBOARD: '/dashboard'
} as const;

export const ROUTES = transformObject(RAW_ROUTES, (value) => ({
	get url() {
		return new URL(value, ORIGIN);
	},
	get pathname() {
		return this.url.pathname;
	},
	toString() {
		return this.pathname;
	}
}));
