<script lang="ts">
	import { trpcClient } from '$lib/trpc/client';
	import type { Grandma } from '@prisma/client';
	import { AccordionItem, Accordion, Button, Label, Input } from 'flowbite-svelte';

	let grandma_username: string = '';
	let get_by_username_grandma: string = '{}';
	let get_by_username_user: string = '{}';

	async function get_grandma_with_username() {
		let grandma = await trpcClient.getGrandmaWithUsername.query({username: grandma_username});
		get_by_username_grandma = JSON.stringify(grandma, null, 2);
		let user = await trpcClient.getUserByUsername.query({username: grandma_username});
		get_by_username_user = JSON.stringify(user, null, 2);
	}
</script>

<AccordionItem>
	<span slot="header">Get by username</span>
	<div class="mb-2">
		<Label class="mb-2">username</Label>
		<Input type="text" bind:value={grandma_username} />
	</div>

	<div class="mb-2">
		<Button on:click={get_grandma_with_username}>Get</Button>
	</div>

	<h1 class="text-lg mb-2">Grandma record:</h1>

	<div class="mb-2 max">
		<pre class="overflow-auto max-w-6xl">
{get_by_username_grandma}
        </pre>
	</div>

	<h1 class="text-lg mb-2">User record:</h1>

	<div class="mb-2 max">
		<pre class="overflow-auto max-w-6xl">
{get_by_username_user}
        </pre>
	</div>
</AccordionItem>
