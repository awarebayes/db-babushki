<script lang="ts">
	import type { Meal } from '../../../../node_service/entities/generated_models';
	import { trpcClient } from '$lib/trpc/client';
	import { Button, Card } from 'flowbite-svelte';
	import MealAdmin from './MealAdmin.svelte';
	import { onMount } from 'svelte';

	let meals: Meal[] = [];

	async function get_meals() {
		let user = await trpcClient.whoAmI.query();
		let grandma = await trpcClient.getGrandmaWithUsername.query({username: user?.username!});
		meals = (await trpcClient.getMealsOfGrandma.query({grandmaId: grandma?.id!}))!;
	}

	function deleteMeal(mealId: number) {
		meals = meals.filter((item)=>item.id!=mealId)
	}

	onMount(get_meals);
</script>

<div>
	<div class="text-center mb-4 mt-2">
		<Button color="green" href="/admin-grandma/new-meal">+ Новое блюдо</Button>
	</div>

	<h2 class="text-center text-lg text-gray-500 mb-2">Ваши блюда</h2>

	<div class="grid md:grid-cols-3 md:gap-3">
		{#each meals as meal}
			<div class="mb-2">
				<MealAdmin {meal} deleteCb={deleteMeal}/>
			</div>
		{/each}
	</div>
</div>
