import { google } from '$lib/server/auth';
import { error, isRedirect, redirect } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { GOOGLE_PROVIDER_ID } from '$lib/const/auth';
import { authService } from '$lib/server/services/auth';
import { dbService } from '$lib/server/services/db';
import { OAuth2RequestError } from 'arctic';
import { db } from '$lib/server/db';

export const GET: RequestHandler = async (event) => {
	const { cookies, url, setHeaders } = event;

	// Disable cache
	setHeaders({ 'Cache-Control': 'no-cache' });

	// Validate callback
	const { valid, code, codeVerifier } = authService.google.validateCallbackCookies(
		cookies,
		url,
		true
	);
	if (!valid) return error(400, 'Invalid state or code');

	try {
		// Exchange code for tokens and fetch user info
		const tokens = await google.validateAuthorizationCode(code, codeVerifier);
		const googleUser = await authService.google.fetchGoogleUserFromAPI(tokens.accessToken);

		// Check for existing user and account
		const existingUser = await dbService.user.getUserByEmail(googleUser.email);
		let existingAccount = await dbService.user.getUserAccount(
			GOOGLE_PROVIDER_ID,
			googleUser.sub
		);

		// Handle existing user and account
		if (existingUser) {
			// if account does not exist
			if (!existingAccount) {
				existingAccount = await db.account.create({
					data: {
						providerId: GOOGLE_PROVIDER_ID,
						providerUserId: googleUser.sub,
						user: { connect: { id: existingUser.id } }
					}
				});
			}

			await authService.createAndSetSessionCookie(
				existingUser.id,
				existingAccount.providerId,
				cookies
			);

			return redirect(302, '/');
		}

		// generate user id
		const userId = authService.generateUserId();

		// create
		const { account } = await dbService.user.createAccountAndEnsureUser({
			account: {
				providerId: GOOGLE_PROVIDER_ID,
				providerUserId: googleUser.sub
			},
			user: {
				id: userId,
				email: googleUser.email,
				name: googleUser.name,
				avatar: googleUser.picture
			}
		});

		await authService.createAndSetSessionCookie(userId, account.providerId, cookies);

		return redirect(302, '/');
	} catch (e) {
		// Handle errors
		if (isRedirect(e)) throw e;
		if (e instanceof OAuth2RequestError) return error(400, 'OAuth Failed');
		return error(500, 'Something went wrong');
	}
};
