import { Lucia } from 'lucia';
import { dev } from '$app/environment';
import { PrismaAdapter } from '@lucia-auth/adapter-prisma';
import { db } from '$lib/server/db';
import { GitHub } from 'arctic';
import { GITHUB_AUTH_CLIENT_ID, GITHUB_AUTH_SECRET } from '$env/static/private';

const adapter = new PrismaAdapter(db.session, db.user);

export const github = new GitHub(GITHUB_AUTH_CLIENT_ID, GITHUB_AUTH_SECRET);

export const lucia = new Lucia(adapter, {
	sessionCookie: {
		attributes: {
			// set to `true` when using HTTPS
			secure: !dev
		}
	},
	getSessionAttributes(attributes) {
		console.log(attributes);
		return {};
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

interface DatabaseSessionAttributes {}
