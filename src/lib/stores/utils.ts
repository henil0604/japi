import { BREAKPOINTS } from '$lib/const/ui';
import { mediaQuery } from 'svelte-legos';

export const isTabletViewport = mediaQuery(`(width <= ${BREAKPOINTS.TABLET})`);
