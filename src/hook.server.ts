import { sequence } from '@sveltejs/kit/hooks';
import { trpcHook } from '$lib/server/trpc/hook';

export const handle = sequence(trpcHook);
