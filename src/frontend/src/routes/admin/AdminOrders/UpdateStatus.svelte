<script>
	import { trpcClient } from '$lib/trpc/client';
	import { AccordionItem, Button, Label, Input } from 'flowbite-svelte';

	let order_status = 0;
	let order_to_update_status_id = 0;

	async function change_status() {
		order_status = Number(order_status);
		order_to_update_status_id = Number(order_to_update_status_id);
		await trpcClient.updateOrderStatusAsAdmin.query({
			orderId: order_to_update_status_id,
			newStatus: order_status
		});
	}
</script>

<AccordionItem>
	<span slot="header">Update Order Status</span>
	<div class="mb-2">
		<Label class="mb-2">Order ID</Label>
		<Input type="number" bind:value={order_to_update_status_id} />
	</div>
	<div class="mb-2">
		<Label class="mb-2">Order Status</Label>
		<Input type="number" bind:value={order_status} />
	</div>
	<div class="mb-2">
		<Button on:click={change_status}>Update status</Button>
	</div>
</AccordionItem>
