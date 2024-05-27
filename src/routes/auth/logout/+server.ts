import { error, redirect } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { authService } from '$lib/server/services/auth';
import { NEXT_REDIRECT_SEARCH_PARAMETER_NAME } from '$lib/const/auth';

export const GET: RequestHandler = async (event) => {
	const { locals, cookies, url } = event;

	const { session } = locals;

	if (!session?.id) {
		throw error(401, 'Unauthorized');
	}

	const { cookie: blankSessionCookie } = await authService.logoutSession(session.id);

	cookies.set(
		blankSessionCookie.name,
		blankSessionCookie.value,
		authService.generateCookieSetOptions('/')
	);

	const redirectTo = url.searchParams.get(NEXT_REDIRECT_SEARCH_PARAMETER_NAME) ?? '/';

	throw redirect(307, redirectTo);
};
