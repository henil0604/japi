import { sequence } from '@sveltejs/kit/hooks';
import { trpcHook } from '$lib/server/trpc/hook';
import { authHook } from '$lib/server/auth/hook';

export const handle = sequence(authHook, trpcHook);
