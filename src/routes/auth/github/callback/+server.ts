import { OAuth2RequestError } from 'arctic';
import type { RequestHandler } from './$types';
import { github, lucia } from '$lib/server/auth';
import { generateIdFromEntropySize, type RegisteredDatabaseSessionAttributes } from 'lucia';
import { db } from '$lib/server/db';
import { GITHUB_OAUTH_STATE_COOKIE_NAME } from '$lib/const/auth';
import { error, isRedirect, redirect } from '@sveltejs/kit';

async function getGithubUser(accessToken: string) {
	// make fetch request to github API
	const githubUserResponse = await fetch('https://api.github.com/user', {
		headers: {
			Authorization: `Bearer ${accessToken}`
		}
	});
	// convert to json
	const githubUser: GitHubUser = await githubUserResponse.json();

	return githubUser;
}

async function getPrimaryEmail(accessToken: string) {
	// make fetch request to github API
	const githubUserEmailsResponse = await fetch('https://api.github.com/user/emails', {
		headers: {
			Authorization: `Bearer ${accessToken}`
		}
	});

	interface GithubEmail {
		email: string;
		primary: boolean;
		visibility: string | null;
		verified: boolean;
	}

	// convert to json
	const emails: GithubEmail[] = await githubUserEmailsResponse.json();

	// find the email that is either ( verified & primary ) or ( verified )
	const primaryEmail =
		emails.find((email) => (email.primary && email.verified) || email.verified)?.email ?? null;

	return primaryEmail;
}

function getAccount(providerId: string) {
	return db.account.findFirst({
		where: {
			provider_id: 'github',
			provider_user_id: providerId
		}
	});
}

function validateCodeAndState(url: URL, storedState: string | null) {
	const code = url.searchParams.get('code');
	const state = url.searchParams.get('state');

	if (!code || !state || !storedState || state !== storedState) {
		throw error(400, 'Invalid state or code');
	}

	return {
		code,
		state
	};
}

async function createUserSessionCookie(
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

export const GET: RequestHandler = async (event) => {
	const { cookies, url } = event;

	// grab state from stored cookie
	const storedState = cookies.get(GITHUB_OAUTH_STATE_COOKIE_NAME) ?? null;
	// validate state and code. grab code
	const { code } = validateCodeAndState(url, storedState);

	// delete stored state
	cookies.delete(GITHUB_OAUTH_STATE_COOKIE_NAME, {
		path: '/'
	});

	try {
		// get tokens from github
		const tokens = await github.validateAuthorizationCode(code);

		// get user from github
		const githubUser = await getGithubUser(tokens.accessToken);

		// get account from database
		const existingAccount = await getAccount(githubUser.id.toString());

		// if account already exists (early return)
		if (existingAccount) {
			const { cookie: sessionCookie } = await createUserSessionCookie(
				existingAccount.userId,
				{}
			);

			// set cookie
			cookies.set(sessionCookie.name, sessionCookie.value, {
				path: '.',
				...sessionCookie.attributes
			});

			throw redirect(302, '/');
		}

		// get user email
		const userPrimaryEmail = await getPrimaryEmail(tokens.accessToken);

		// if not email found
		if (!userPrimaryEmail) {
			throw error(400, 'Primary/Verified email not found');
		}

		// generate userId
		const userId = generateIdFromEntropySize(10);

		// create user
		await db.user.create({
			data: {
				id: userId,
				email: userPrimaryEmail,
				name: githubUser.name,
				avatar: githubUser.avatar_url
			}
		});

		// create account
		await db.account.create({
			data: {
				provider_id: 'github',
				provider_user_id: githubUser.id.toString(),
				user: {
					connect: {
						id: userId
					}
				}
			}
		});

		// create session cookie
		const { cookie: sessionCookie } = await createUserSessionCookie(userId, {});

		// set cookie
		cookies.set(sessionCookie.name, sessionCookie.value, {
			path: '.',
			...sessionCookie.attributes
		});

		throw redirect(302, '/');
	} catch (e) {
		if (isRedirect(e)) throw e;

		// the specific error message depends on the provider
		if (e instanceof OAuth2RequestError) {
			throw error(400, 'OAuth Failed');
		}

		throw error(500, 'Something went wrong');
	}
};

// user object coming from github api
interface GitHubUser {
	id: number;
	login: string;
	avatar_url?: string;
	name: string;

	// extra also come but we don't need
}
