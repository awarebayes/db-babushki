<script lang="ts">
	import { trpcClient } from '$lib/trpc/client';
	import { AccordionItem, Button, Label, Input, Toggle } from 'flowbite-svelte';

	let verify_grandma_id: number = 0;
	let verify_grandma_status: boolean = true;

	async function verify_grandma() {
		verify_grandma_id = Number(verify_grandma_id);
		await trpcClient.verifyGrandma.query({ id: verify_grandma_id, status: verify_grandma_status });
	}
</script>

<AccordionItem>
	<span slot="header">Change verification status</span>

	<div class="mb-2">
		<Label class="mb-2">ID</Label>
		<Input type="number" bind:value={verify_grandma_id} />
	</div>

	<div class="mb-2">
		<Toggle
			on:click={() => {
				verify_grandma_status = !verify_grandma_status;
			}}
			checked={verify_grandma_status}>Verified</Toggle
		>
	</div>

	<div class="mb-2">
		<Button color="green" on:click={verify_grandma}>Verify</Button>
	</div>
</AccordionItem>
