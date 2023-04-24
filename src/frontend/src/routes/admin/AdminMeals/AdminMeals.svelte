<script lang="ts">
	import { trpcClient } from '$lib/trpc/client';
	import { AccordionItem, Accordion, Button, Label, Input } from 'flowbite-svelte';
	import ListMeals from './ListMeals.svelte';
	import GenerateFake from './GenerateFake.svelte';
	import ListMealsOfGrandma from './ListMealsOfGrandma.svelte';

	let generated_meals = '[]';
	let min_meals = 1;
	let max_meals = 3;


	async function generate_meals() {
		min_meals = Number(min_meals);
		max_meals = Number(max_meals);
		generated_meals = JSON.stringify(
			await trpcClient.generateFakeMeals.query({ min: min_meals, max: max_meals }),
			null,
			2
		);
	}
</script>

<div class="max-w-screen">
	<Accordion>
		<ListMeals/>
		<GenerateFake/>
		<ListMealsOfGrandma/>
	</Accordion>
</div>
