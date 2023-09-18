<script lang="ts">
	import { trpcClient } from '$lib/trpc/client';
	import { AccordionItem, Accordion, Button, Label, Input } from 'flowbite-svelte';

	let grandmas_fetched_text = '';
	let get_page: number = 0;

	async function get_grandmas() {
		get_page = Number(get_page);
		let grandmas = (await trpcClient.getGrandmas.query({page: get_page}))!;
		grandmas_fetched_text = JSON.stringify(grandmas, null, 2);
	}
</script>

<AccordionItem>
	<span slot="header">Get all paged</span>

	<div class="mb-2">
		<Label class="mb-2">Page</Label>
		<Input type="number" bind:value={get_page} />
	</div>

	<div class="mb-2">
		<Button color="green" on:click={get_grandmas}>Get</Button>
	</div>

	<div class="mb-2">
		<pre class="overflow-auto max-w-6xl">
{grandmas_fetched_text}
        </pre>
	</div>
</AccordionItem>
