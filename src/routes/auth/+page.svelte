<script lang="ts">
	import { useAuth } from '$lib/use/auth';
</script>

<button onclick={() => useAuth.signIn('google')}>Continue with Google</button>
<button onclick={() => useAuth.signIn('github')}>Continue with Github</button>

<style>
	:global {
		html,
		body {
			height: 100%;
		}

		body {
			display: flex;
			flex-direction: column;
			justify-content: center;
			align-items: center;
			gap: 10px;

			button {
				border: 1px solid #999;
				padding: 10px 15px;
				border-radius: 5px;
				transition: 0.3s all;

				&:hover {
					background-color: #000;
					color: #fff;
				}
			}
		}
	}
</style>
