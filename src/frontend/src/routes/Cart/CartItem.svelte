<script lang="ts">
	import { cart } from '$lib/misc/singletons';
	import type { FrontEndMealClaim } from '$lib/misc/types';
	import type { Meal } from '@prisma/client';

	export let mealClaim: FrontEndMealClaim;
	let meal: Meal = mealClaim.meal;

	let inCart = false;
	let quantity = 0;

	$: {
		inCart = false;
		$cart.forEach((item) => {
			if (item.mealId === meal.id) {
				inCart = true;
				quantity = item.count;
			}
		});
	}

	function getItemCount(meal: Meal) {
		let quantity = 0;
		for (const item of $cart) {
			if (item.mealId === meal.id) {
				quantity = item.count;
			}
		}
		return quantity;
	}

	function addToCart(meal: Meal) {
		let quantity = getItemCount(meal);
		let updatedCart;
		let claim: FrontEndMealClaim = { count: 1, mealId: meal.id, meal: meal };
		if (quantity === 0) {
			updatedCart = [...$cart, claim];
		} else {
			updatedCart = $cart;
			for (let item of $cart) {
				if (item.mealId === meal.id) {
					item.count++;
				}
			}
		}
		cart.set(updatedCart);
	}

	function removeFromCart(meal: Meal) {
		let updatedCart;
		let quantity = getItemCount(meal);
		if (quantity <= 0) {
			return;
		}
		if (quantity === 1) {
			updatedCart = $cart.filter((el) => {
				return el.mealId !== meal.id;
			});
		} else {
			updatedCart = $cart;
			for (let item of $cart) {
				if (item.mealId === meal.id) {
					item.count--;
				}
			}
		}
		cart.set(updatedCart);
	}
</script>

<p class="dropdown-item is-flex is-flex-direction-row justify-between">
	<span>{meal.name}</span>
	<span>
		<a class="button is-small border-0" on:click={() => removeFromCart(meal)}>
			<span class="icon">
				<i class="fas fa-minus" />
			</span>
		</a>
		<span>{mealClaim.count}</span>
		<a class="button is-small border-0" on:click={() => addToCart(meal)}>
			<span class="icon">
				<i class="fas fa-plus" />
			</span>
		</a>
	</span>
</p>
