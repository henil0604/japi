import { fontFamily } from 'tailwindcss/defaultTheme';
import type { Config } from 'tailwindcss';

const config: Config = {
	darkMode: ['class'],
	content: ['./src/**/*.{html,js,svelte,ts}'],
	safelist: ['dark'],
	theme: {
		container: {
			center: true,
			padding: '2rem',
			screens: {
				'2xl': '1400px'
			}
		},
		extend: {
			colors: {
				border: 'hsl(var(--clr-border) / <alpha-value>)',
				input: 'hsl(var(--clr-input) / <alpha-value>)',
				ring: 'hsl(var(--clr-ring) / <alpha-value>)',
				background: 'hsl(var(--clr-background) / <alpha-value>)',
				foreground: 'hsl(var(--clr-foreground) / <alpha-value>)',
				primary: {
					DEFAULT: 'hsl(var(--clr-primary) / <alpha-value>)',
					foreground: 'hsl(var(--clr-primary-foreground) / <alpha-value>)'
				},
				secondary: {
					DEFAULT: 'hsl(var(--clr-secondary) / <alpha-value>)',
					foreground: 'hsl(var(--clr-secondary-foreground) / <alpha-value>)'
				},
				destructive: {
					DEFAULT: 'hsl(var(--clr-destructive) / <alpha-value>)',
					foreground: 'hsl(var(--clr-destructive-foreground) / <alpha-value>)'
				},
				brand: {
					DEFAULT: 'hsl(var(--clr-brand) / <alpha-value>)',
					foreground: 'hsl(var(--clr-brand-foreground) / <alpha-value>)'
				},
				muted: {
					DEFAULT: 'hsl(var(--clr-muted) / <alpha-value>)',
					foreground: 'hsl(var(--clr-muted-foreground) / <alpha-value>)'
				},
				accent: {
					DEFAULT: 'hsl(var(--clr-accent) / <alpha-value>)',
					foreground: 'hsl(var(--clr-accent-foreground) / <alpha-value>)'
				},
				popover: {
					DEFAULT: 'hsl(var(--clr-popover) / <alpha-value>)',
					foreground: 'hsl(var(--clr-popover-foreground) / <alpha-value>)'
				},
				card: {
					DEFAULT: 'hsl(var(--clr-card) / <alpha-value>)',
					foreground: 'hsl(var(--clr-card-foreground) / <alpha-value>)'
				}
			},
			borderRadius: {
				lg: 'var(--br-radius)',
				md: 'calc(var(--br-radius) - 2px)',
				sm: 'calc(var(--br-radius) - 4px)'
			},
			fontFamily: {
				sans: ['Inter', ...fontFamily.sans]
			}
		}
	}
};

export default config;
