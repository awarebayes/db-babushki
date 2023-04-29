<script lang="ts">
	import Cart from './Cart/Cart.svelte';
	import icon from '../lib/images/icon.png';
	import { onMount } from 'svelte';
	import { setTRPCToken, trpcClient } from '$lib/trpc/client';
	import { browser } from '$app/environment';
	import type { User } from '../../../node_service/entities/generated_models';

	let logged_in: boolean = false;
	let is_admin = false;
	let is_grandma = false;

	let user: User;

	async function logOut() {
		localStorage.setItem("jwt", "null");
		setTRPCToken("null");
		logged_in = false;
	}

	async function updateAuthStatus() {
		let maybeUser = await trpcClient.whoAmI.query();
		if (maybeUser)
		{
			logged_in = true;
			user = maybeUser!;
		}
		is_admin = await trpcClient.amIAdmin.query();
		is_grandma = await trpcClient.amIGrandma.query();
	}

	onMount(updateAuthStatus);
</script>

<header>
	<nav class="navbar" role="navigation" aria-label="main navigation">
		<div class="navbar-brand">
			<a class="navbar-item" href="/" id="logo-font">
				<span class="image is-32x32">
					<img src={icon} class="pl-1 mt-0.5" alt="icon" />
				</span>
				<span class="ml-2"> Бабушка готовит </span>
			</a>
			<a
				role="button"
				class="navbar-burger"
				aria-label="menu"
				aria-expanded="false"
				data-target="navbarBasicExample"
			>
				<span aria-hidden="true" />
				<span aria-hidden="true" />
				<span aria-hidden="true" />
			</a>
		</div>

		<div id="navbarBasicExample" class="navbar-menu">
			<div class="navbar-start">
				<span class="navbar-item" />

				<a class="navbar-item" href="/grandmas"> Бабушки </a>

				<a class="navbar-item" href="/meals"> Блюда </a>

				{#if is_grandma}
					<a class="navbar-item" href="/admin-grandma"> Кабинет Бабушки </a>
				{:else}
					<a class="navbar-item" href="/new-grandma"> Готовьте с нами </a>
				{/if}
				{#if is_admin}
					<a class="navbar-item" href="/admin"> Админка </a>
				{/if}

				<a class="navbar-item"> О нас </a>
			</div>

			<div class="navbar-end">
				{#if !logged_in}
					<div class="navbar-item">
						<div class="buttons">
							<a class="button is-primary" href="/sign-up">
								<strong>Зарегистрироваться</strong>
							</a>
							<a class="button is-light" href="/sign-in"> Войти </a>
						</div>
					</div>
				{:else}
					<div class="navbar-item">
						<Cart />
					</div>
					<div class="navbar-item">
						<nav class="navbar" role="navigation" aria-label="dropdown navigation">
							<div class="navbar-item has-dropdown is-hoverable">
								<a class="navbar-link">
									{user.username}
								</a>
								<div class="navbar-dropdown">
									<a class="navbar-item"> Настройки </a>
									<a class="navbar-item" href="/account/orders"> Заказы </a>
									<hr class="navbar-divider" />
									<a class="navbar-item" on:click={logOut}> Выйти </a>
								</div>
							</div>
						</nav>
					</div>
				{/if}
			</div>
		</div>
	</nav>
</header>

<style>
	#logo-font {
		font-family: 'Roboto', sans-serif;
		font-weight: bold;
	}
</style>
