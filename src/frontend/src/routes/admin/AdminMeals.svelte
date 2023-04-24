<script lang="ts">
	import { authRepository } from '$lib/misc/impl_pocketbase_browser';
	import { jwtLoaded } from '$lib/misc/singletons';
	import { trpcClient } from '$lib/trpc/client';
	import type { Grandma } from '@prisma/client';
	import { AccordionItem, Accordion, Button, Label, Input } from 'flowbite-svelte';

	let page = 0;
	let all_meals = '[]';
	let generated_meals = '[]';

	let min_meals = 1;
	let max_meals = 3;

	async function list_meals() {
		page = Number(page);
		all_meals = JSON.stringify(await trpcClient.getMeals.query(page), null, 2);
	}

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
		<AccordionItem>
			<span slot="header">List meals</span>

			<div class="mb-2">
				<Label class="mb-2">Page</Label>
				<Input type="number" bind:value={page} />
			</div>
			<div class="mb-2">
				<Button on:click={list_meals}>Get</Button>
			</div>

			<div class="mb-2 max">
				<pre class="overflow-auto max-w-6xl">
{all_meals}
                </pre>
			</div>
		</AccordionItem>
		<AccordionItem>
			<span slot="header">Generate fake meals</span>

			<div class="mb-2">
				<Label class="mb-2">Min # meals</Label>
				<Input type="number" bind:value={min_meals} />
			</div>

			<div class="mb-2">
				<Label class="mb-2">Max # meals</Label>
				<Input type="number" bind:value={max_meals} />
			</div>

			<div class="mb-2">
				<Button on:click={generate_meals}>Get</Button>
			</div>

			<div class="mb-2 max">
				<pre class="overflow-auto max-w-6xl">
{generated_meals}
                </pre>
			</div>
		</AccordionItem>
	</Accordion>
</div>
