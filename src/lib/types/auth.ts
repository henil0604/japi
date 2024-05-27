import type { AUTH_PROVIDER_ROUTES } from '$lib/const/auth';

export type AuthProvider = keyof typeof AUTH_PROVIDER_ROUTES;
