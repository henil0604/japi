import { Lucia } from 'lucia';
import { dev } from '$app/environment';
import { PrismaAdapter } from '@lucia-auth/adapter-prisma';
import { db } from '$lib/server/db';
import { GitHub, Google } from 'arctic';
import {
	GITHUB_AUTH_CLIENT_ID,
	GITHUB_AUTH_SECRET,
	GOOGLE_AUTH_CLIENT_ID,
	GOOGLE_AUTH_CLIENT_SECRET
} from '$env/static/private';
import { ROUTES } from '$lib/const/routes';

const GOOGLE_AUTH_REDIRECT_URI = `${ROUTES.AUTH_GOOGLE_CALLBACK.url.href}`;

const adapter = new PrismaAdapter(db.session, db.user);

export const github = new GitHub(GITHUB_AUTH_CLIENT_ID, GITHUB_AUTH_SECRET);

export const google = new Google(
	GOOGLE_AUTH_CLIENT_ID,
	GOOGLE_AUTH_CLIENT_SECRET,
	GOOGLE_AUTH_REDIRECT_URI
);

export const lucia = new Lucia(adapter, {
	sessionCookie: {
		attributes: {
			// set to `true` when using HTTPS
			secure: !dev
		}
	},
	getSessionAttributes(attributes) {
		return {
			providerId: attributes.providerId
		};
	},
	getUserAttributes: (attributes) => {
		return {
			name: attributes.name,
			email: attributes.email,
			avatar: attributes.avatar
		};
	}
});

declare module 'lucia' {
	interface Register {
		Lucia: typeof lucia;
		DatabaseUserAttributes: DatabaseUserAttributes;
		DatabaseSessionAttributes: DatabaseSessionAttributes;
	}
}

interface DatabaseUserAttributes {
	name: string;
	email: string;
	avatar?: string;
}

interface DatabaseSessionAttributes {
	providerId: string;
}
