<script lang="ts">
	import { trpcClient } from '$lib/trpc/client';
	import type { Grandma } from '@prisma/client';
	import { AccordionItem, Accordion, Button, Label, Input } from 'flowbite-svelte';

	let grandma_username: string = '';
	let get_by_username_text: string = '{}';

	async function get_grandma_with_username() {
		let grandma = await trpcClient.getGrandmaWithUsername.query(grandma_username);
		get_by_username_text = JSON.stringify(grandma, null, 2);
	}
</script>

<AccordionItem>
	<span slot="header">Create for user</span>

	<div class="mb-2">
		<Button on:click={create_grandma_for_user}>Create</Button>
	</div>

	<div class="mb-2 max">
		<pre class="overflow-auto max-w-6xl">
{created_grandma_for_user_text}
    </pre>
	</div>
</AccordionItem>
