<script lang="ts">
	import { trpcClient } from '$lib/trpc/client';
	import type { Grandma } from '@prisma/client';
	import { AccordionItem, Accordion, Button, Label, Input } from 'flowbite-svelte';

	let created_grandma_text: string = '{}';

	async function create_dummy_grandma() {
		let grandma = await trpcClient.createDummyGrandmaWithUser.query();
		created_grandma_text = JSON.stringify(grandma, null, 2);
	}
</script>

<AccordionItem>
	<span slot="header">Create dummy</span>

	<div class="mb-2">
		<Button on:click={create_dummy_grandma}>Create</Button>
	</div>

	<div class="mb-2 max">
		<pre class="overflow-auto max-w-6xl">
{created_grandma_text}
    </pre>
	</div>
</AccordionItem>
