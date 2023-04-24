<script lang="ts">
	import { trpcClient } from '$lib/trpc/client';
	import type { Grandma } from '@prisma/client';
	import { AccordionItem, Button, Label, Input } from 'flowbite-svelte';

	let grandma_id = 0;
	let all_meals = '[]';

	async function list_meals() {
		grandma_id = Number(grandma_id);
		all_meals = JSON.stringify(await trpcClient.getMealsOfGrandma.query(grandma_id), null, 2);
	}

</script>



<AccordionItem>
    <span slot="header">List meals of Grandma</span>
    <div class="mb-2">
        <Label class="mb-2">Grandma ID</Label>
        <Input type="number" bind:value={grandma_id} />
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