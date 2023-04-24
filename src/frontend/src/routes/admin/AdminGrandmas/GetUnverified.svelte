<script lang="ts">
	import { trpcClient } from '$lib/trpc/client';
	import { AccordionItem, Accordion, Button, Label, Input } from 'flowbite-svelte';

	let grandmas_fetched_text = '';

	async function get_grandmas() {
		let grandmas = (await trpcClient.getUnverified.query())!;
		grandmas_fetched_text = JSON.stringify(grandmas, null, 2);
	}
</script>

<AccordionItem>
	<span slot="header">Get unverified</span>

	<div class="mb-2">
		<Button color="green" on:click={get_grandmas}>Get</Button>
	</div>

	<div class="mb-2">
		<pre class="overflow-auto max-w-6xl">
{grandmas_fetched_text}
        </pre>
	</div>
</AccordionItem>
