<script lang="ts">
	import { trpcClient } from '$lib/trpc/client';
	import { AccordionItem, Button, Label, Input } from 'flowbite-svelte';

	let delete_grandma_id: number = 0;

	async function delete_grandma() {
		delete_grandma_id = Number(delete_grandma_id);
		await trpcClient.deleteGrandma.query({id: delete_grandma_id});
	}
</script>

<AccordionItem>
	<span slot="header">Delete</span>

	<div class="mb-2">
		<Label class="mb-2">ID</Label>
		<Input type="number" bind:value={delete_grandma_id} />
	</div>

	<div class="mb-2">
		<Button color="green" on:click={delete_grandma}>Get</Button>
	</div>
</AccordionItem>
