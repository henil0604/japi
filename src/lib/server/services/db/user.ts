import { db } from '$lib/server/db';
import type { User, Account } from '@prisma/client';

export function getUserAccount(providerId: string, providerUserId: string) {
	return db.account.findFirst({
		where: {
			providerId: providerId,
			providerUserId: providerUserId
		}
	});
}

interface CreateAccountAndEnsureUserData {
	user: Omit<User, 'createdAt'>;
	account: Pick<Account, 'providerId' | 'providerUserId'>;
}
export async function createAccountAndEnsureUser(data: CreateAccountAndEnsureUserData) {
	const account = await db.account.create({
		data: {
			providerId: data.account.providerId,
			providerUserId: data.account.providerUserId,
			user: {
				connectOrCreate: {
					where: {
						id: data.user.id
					},
					create: {
						id: data.user.id,
						email: data.user.email,
						name: data.user.name,
						avatar: data.user.avatar
					}
				}
			}
		},
		include: {
			user: true
		}
	});

	return {
		account,
		user: account.user
	};
}

export function getUserByEmail(email: string) {
	return db.user.findFirst({
		where: {
			email
		}
	});
}
