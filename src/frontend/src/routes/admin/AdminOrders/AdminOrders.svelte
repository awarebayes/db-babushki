<script lang="ts">
	import { trpcClient } from '$lib/trpc/client';
	import { AccordionItem, Accordion, Button, Label, Input } from 'flowbite-svelte';
	import CreateDummy from '../AdminGrandmas/CreateDummy.svelte';
	import ListOrders from './ListOrders.svelte';
	import UpdateStatus from './UpdateStatus.svelte';

	let page: number = 0;
	let created_order_text: string = '{}';
	let list_text: string = '';

	let order_status = 0;
	let order_to_update_status_id = 0;

	async function list() {
		page = Number(page);
		list_text = JSON.stringify(await trpcClient.getOrdersAdmin.query({page}), null, 2);
	}

	async function change_status() {
		order_status = Number(order_status);
		order_to_update_status_id = Number(order_to_update_status_id);
		await trpcClient.updateOrderStatusAsAdmin.query({
			orderId: order_to_update_status_id,
			newStatus: order_status
		});
	}
</script>

<div class="max-w-screen">
	<Accordion>
		<CreateDummy />

		<ListOrders />

		<UpdateStatus />
	</Accordion>
</div>
