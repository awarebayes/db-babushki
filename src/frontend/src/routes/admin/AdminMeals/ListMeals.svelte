<script lang="ts">
	import { trpcClient } from '$lib/trpc/client';
	import type { Grandma } from '@prisma/client';
	import { AccordionItem, Button, Label, Input } from 'flowbite-svelte';

	let page = 0;
	let all_meals = '[]';

	async function list_meals() {
		page = Number(page);
		all_meals = JSON.stringify(await trpcClient.getMeals.query({page}), null, 2);
	}
</script>

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
