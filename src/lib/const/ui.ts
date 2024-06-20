import { transformObject } from '$lib/utils/transformObject';
import { ROUTES } from './routes';

export const ICONS = {
	BRAND: {
		GOOGLE: 'mdi:google',
		GITHUB: 'mdi:github'
	},
	LIGHTNING_FILLED: 'ph:lightning-fill',
	TIMER_FILLED: 'basil:timer-solid',
	SERVER_FILLED: 'mdi:server',
	ARROW_RIGHT: 'formkit:arrowright',
	CHECK: 'mdi:check',
	CHECK_CIRCLE: 'lets-icons:check-fill',
	MOUSE: 'bi:mouse'
};

export const SUPPORTED_TABLET_ROUTES = [ROUTES.LANDING.pathname, ROUTES.AUTH_BASE.pathname];

export const BREAKPOINTS = transformObject(
	{
		TABLET: 768
	},
	(entity, key) => {
		return {
			get px() {
				return `${entity}px`;
			},
			get raw() {
				return entity;
			},
			toString() {
				return this.px;
			}
		};
	}
);
