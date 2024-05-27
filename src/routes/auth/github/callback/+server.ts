import { OAuth2RequestError } from 'arctic';
import type { RequestHandler } from './$types';
import { github } from '$lib/server/auth';
import { GITHUB_PROVIDER_ID, NEXT_REDIRECT_SEARCH_PARAMETER_NAME } from '$lib/const/auth';
import { error, isRedirect, redirect } from '@sveltejs/kit';
import { authService } from '$lib/server/services/auth';
import { dbService } from '$lib/server/services/db';
import { db } from '$lib/server/db';
import { ROUTES } from '$lib/const/routes';

export const GET: RequestHandler = async (event) => {
	const { cookies, url, setHeaders } = event;

	// Disable cache
	setHeaders({ 'Cache-Control': 'no-cache' });

	// Validate callback
	const { code, valid: isRequestValid } = authService.github.validateCallbackCookies(
		cookies,
		url,
		true
	);
	if (!isRequestValid) return error(400, 'Invalid state or code');

	const redirectToURL = cookies.get(NEXT_REDIRECT_SEARCH_PARAMETER_NAME) ?? '/';

	try {
		// Exchange code for tokens and fetch user info
		const tokens = await github.validateAuthorizationCode(code);

		// fetch user from github
		const githubUser = await authService.github.fetchGithubUserFromAPI(tokens.accessToken);

		// Fetch user's primary email
		const userPrimaryEmail = await authService.github.fetchUserPrimaryEmailFromAPI(
			tokens.accessToken
		);
		if (!userPrimaryEmail) return error(400, 'Primary/Verified email not found');

		// Check for existing account
		const existingUser = await dbService.user.getUserByEmail(userPrimaryEmail);
		let existingAccount = await dbService.user.getUserAccount(
			GITHUB_PROVIDER_ID,
			githubUser.id.toString()
		);

		// if user exist
		if (existingUser) {
			// if account does not exist
			if (!existingAccount) {
				// create account
				existingAccount = await db.account.create({
					data: {
						providerId: GITHUB_PROVIDER_ID,
						providerUserId: githubUser.id.toString(),
						user: { connect: { id: existingUser.id } }
					}
				});
			}

			await authService.createAndSetSessionCookie(
				existingUser.id,
				existingAccount.providerId,
				cookies
			);
			return redirect(302, redirectToURL);
		}

		// Generate user ID and create user with account
		const userId = authService.generateUserId();
		const { account } = await dbService.user.createAccountAndEnsureUser({
			user: {
				id: userId,
				email: userPrimaryEmail,
				name: githubUser.name,
				avatar: githubUser.avatar_url ?? null
			},
			account: {
				providerId: GITHUB_PROVIDER_ID,
				providerUserId: githubUser.id.toString()
			}
		});

		await authService.createAndSetSessionCookie(userId, account.providerId, cookies);

		return redirect(302, redirectToURL);
	} catch (e) {
		// Handle errors
		if (isRedirect(e)) throw e;
		if (e instanceof OAuth2RequestError) return error(400, 'OAuth Failed');
		return error(500, 'Something went wrong');
	}
};
