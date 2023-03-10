<script lang="ts">
	import Cart from "./Cart/Cart.svelte"
	import icon from "../lib/images/icon.png"
	import {authRepository} from "./data/singletons";
	let user = authRepository.getAuthenticatedUser();
</script>

<header>
	<nav class="navbar" role="navigation" aria-label="main navigation">
		<div class="navbar-brand">
			<a class="navbar-item" href="/" id="logo-font">
				<span class="image is-32x32">
					<img src={icon} class="pl-1 mt-0.5" alt="icon">
				</span>
				<span class="ml-2">
					Бабушка готовит
				</span>
			</a>
			<a role="button" class="navbar-burger" aria-label="menu" aria-expanded="false" data-target="navbarBasicExample">
				<span aria-hidden="true"></span>
				<span aria-hidden="true"></span>
				<span aria-hidden="true"></span>
			</a>
		</div>

		<div id="navbarBasicExample" class="navbar-menu">
			<div class="navbar-start">
				<span class="navbar-item">
				</span>

				<a class="navbar-item" href="/grandmas">
					Бабушки
				</a>

				<a class="navbar-item" href="/meals">
					Блюда
				</a>

				<a class="navbar-item">
					Готовьте с нами
				</a>

				<a class="navbar-item">
					О нас
				</a>

			</div>

			<div class="navbar-end">
				{#if user == null }
				<div class="navbar-item">
					<div class="buttons">
						<a class="button is-primary" href="/sign-up">
							<strong>Зарегистрироваться</strong>
						</a>
						<a class="button is-light" href="/sign-in">
							Войти
						</a>
					</div>
				</div>
				{:else}
					<div class="navbar-item">
						<Cart/>
					</div>
					<div class="navbar-item">
					<nav class="navbar" role="navigation" aria-label="dropdown navigation">
						<div class="navbar-item has-dropdown is-hoverable">
							<a class="navbar-link">
								{ user.username }
							</a>
							<div class="navbar-dropdown">
								<a class="navbar-item">
									Настройки
								</a>
								<hr class="navbar-divider">
								<a class="navbar-item" on:click={authRepository.logOut}>
									Выйти
								</a>
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