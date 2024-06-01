import { mediaQuery } from 'svelte-legos';

export const isTabletViewport = mediaQuery('(width <= 768px)');
