<script lang="ts">
	import { trpcClient } from "$lib/trpc/client";

	let auth_failed = false;
	let username = '';
	let password = '';

	async function signIn() {
		try {
			let token = await trpcClient.signIn.query({password, username})
			auth_failed = false;
			console.log('Auth successful!');
			localStorage.setItem("jwt", token)
			window.location.href = '/';
		} catch (e) {
			auth_failed = true;
		}
	}
</script>

<section class="hero is-fullheight-with-navbar">
	<div class="hero-body columns is-vcentered is-flex h-max">
		<div class="column is-half-desktop is-offset-one-quarter mt-7">
			<form class="box">
				<div class="field">
					<label class="label">Имя пользователя</label>
					<div class="control">
						<input
							class="input"
							bind:value={username}
							placeholder="e.g. misha"
						/>
					</div>
				</div>

				<div class="field">
					<label class="label">Пароль</label>
					<div class="control">
						<input class="input" type="password" bind:value={password} placeholder="********" />
					</div>
				</div>
				<button class="button is-primary" on:click={signIn}>Войти</button>
			</form>

			{#if auth_failed}
				<div class="notification is-danger">Something went wrong! Try again...</div>
			{/if}
		</div>
	</div>
</section>
