<script>
	import { cart } from '$lib/misc/singletons';
	import CartItem from './CartItem.svelte';
	let active = false;
</script>

<div class="dropdown {active ? 'is-active' : ''} is-right">
	<div class="dropdown-trigger">
		<p
			class="icon-text"
			on:click={() => {
				active = !active;
			}}
		>
			{#if $cart.length !== 0}
				<span class="tag is-link is-light is-rounded">{$cart.length}</span>
			{/if}
			<span class="icon">
				<i class="fas fa-shopping-cart" />
			</span>
		</p>
	</div>
	<div class="dropdown-menu" id="dropdown-menu" role="menu">
		<div class="dropdown-content">
			{#if $cart.length > 0}
				{#each $cart as item}
					<CartItem mealClaim={item} />
				{/each}
				<hr class="dropdown-divider" />
				<a class="dropdown-item has-text-centered" href="/checkout"> Заказать </a>
			{:else}
				<p class="dropdown-item is-active has-text-centered">Корзина пуста :(</p>
			{/if}
		</div>
	</div>
</div>

<style>
	.dropdown-menu {
		width: 300px;
	}
</style>
