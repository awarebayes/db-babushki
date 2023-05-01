<script lang="ts">
	import type { FrontEndMealClaim } from '$lib/misc/types';
	import type { Meal } from '@prisma/client';
	import { cart, fileServerUrl } from '$lib/misc/singletons.js';


	export let meal: Meal;
	let inCart: boolean;
	let quantity = 0;

	$: {
		inCart = false;
		for (const item of $cart) {
			if (item.mealId === meal.id) {
				inCart = true;
				quantity = item.count;
			}
		}
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
		let claim: FrontEndMealClaim = { count: 1, mealId: meal.id, meal: meal };
		if (quantity === 0) {
			$cart = [...$cart, claim];
		} else {
			$cart = $cart.map((item)=>{
				if (item.mealId === meal.id)
					item.count++;
				return item;
			})
		}
		$cart = $cart
		console.log("Cart is now on add", $cart)
	}

	function removeFromCart(meal: Meal) {
		let quantity = getItemCount(meal);
		if (quantity <= 0) {
			return;
		}
		if (quantity === 1) {
			$cart = $cart.filter((el) => {
				return el.mealId !== meal.id;
			});
		} else {
			$cart = $cart.map((item)=> {
				if (item.mealId == meal.id)
					item.count--;
				return item;
			})
		}
		$cart = $cart;
		console.log("Cart is now on delete", $cart)
	}
</script>

<div class="box">
	<div class="columns">
		<div class="column is-two-fifths">
			<img
				src="{fileServerUrl}{meal.pictureUrl}?nocache={Math.random()}"
				alt="Meal photo"
				class="image rounded is-256x256 object-cover"
			/>
		</div>
		<div class="column">
			<div class="is-flex is-justify-content-space-between">
				<div>
					<span class="text-2xl text-gray-900">{meal.name}</span>
				</div>
				{#if !inCart}
					<a class="button is-small is-success" on:click={() => addToCart(meal)}>
						<span class="text-lg text-center">{meal.price}р</span>
						<span class="icon">
							<i class="fas fa-shopping-basket" />
						</span>
					</a>
				{:else}
					<span>
						<a class="button is-small border-0" on:click={() => removeFromCart(meal)}>
							<span class="icon">
								<i class="fas fa-minus" />
							</span>
						</a>
						{quantity}
						<a class="button is-small border-0" on:click={() => addToCart(meal)}>
							<span class="icon">
								<i class="fas fa-plus" />
							</span>
						</a>
						<span class="icon">
							<i class="fas fa-shopping-basket" />
						</span>
					</span>
				{/if}
			</div>
			<p class="icon-text">
				<span class="icon">
					<i class="fas fa-star text-yellow-400" />
				</span>
				<span>{meal.rating}/5</span>
				<span class="sep" />
				<span
					>by <a class="text-blue-900" href="/grandmas/{meal.cookedBy}">{meal.cookedByName}</a
					></span
				>
			</p>
			<p class="pt-2">{@html meal.description}</p>
		</div>
	</div>
</div>

<style>
	.sep {
		padding-left: 5px;
		padding-right: 5px;
	}

	.is-256x256 {
		width: 256px;
		height: 256px;
	}
</style>
