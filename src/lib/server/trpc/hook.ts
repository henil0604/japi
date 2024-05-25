import { trpcRouter } from '$lib/server/trpc/router';
import { createTRPCHandle } from 'trpc-sveltekit';
import { createContext } from '$lib/server/trpc';

export const trpcHook = createTRPCHandle({
	router: trpcRouter,
	createContext
});
