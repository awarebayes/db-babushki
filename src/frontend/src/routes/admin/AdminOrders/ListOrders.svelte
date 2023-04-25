<script lang="ts">
	import { trpcClient } from '$lib/trpc/client';
	import { AccordionItem, Accordion, Button, Label, Input } from 'flowbite-svelte';

	let page: number = 0;
	let list_text: string = '';

	async function list() {
		page = Number(page);
		list_text = JSON.stringify(await trpcClient.getOrdersAdmin.query(page), null, 2);
	}
</script>

<AccordionItem>
	<span slot="header">List orders</span>
	<div class="mb-2">
		<Label class="mb-2">Page</Label>
		<Input type="number" bind:value={page} />
	</div>
	<div class="mb-2">
		<Button on:click={list}>Get</Button>
	</div>

	<div class="mb-2 max">
		<pre class="overflow-auto max-w-6xl">
{list_text}
        </pre>
	</div>
</AccordionItem>
