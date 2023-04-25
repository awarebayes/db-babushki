<script lang="ts">
	import { Button, ButtonGroup, Card } from 'flowbite-svelte';
	import type { Meal } from '../../../../node_service/entities/generated_models';
	import { trpcClient } from '$lib/trpc/client';
	export let meal: Meal;
	export let deleteCb: (id: number) => void;

	async function deleteMeal() {
		await trpcClient.deleteMeal.query(meal.id);
		deleteCb(meal.id)
	}
</script>

<section>
	<Card img={meal.pictureUrl}>
		<h1 class="text-center text-2xl text-gray-700">
			{meal.name}
		</h1>
		<p class="mt-2">
			{meal.description}
		</p>
		<div class="flex justify-around mt-4">
				<Button color="alternative" href="/admin-grandma/change-meal?meal_id={meal.id}">Изменить</Button>
				<Button color="alternative" on:click={deleteMeal}>Удалить</Button>
		</div>
	</Card>
</section>
