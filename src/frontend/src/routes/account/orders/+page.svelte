<script lang="ts">
	import { trpcClient } from '$lib/trpc/client';
	import type { ExpandedOrder } from '../../../../../node_service/entities/generated_models';
	import OrderComponent from './Order.svelte';

	let orders: ExpandedOrder[] = [];

	async function updateOrders() {
		orders = await trpcClient.getMyOrders.query();
		console.log('orders!', orders);
	}

	$: updateOrders();
</script>

<section class="min-h-screen grid justify-center">
	<h2 class="text-center text-xl text-gray-700">Заказы</h2>

	<div class="div">
		{#each orders as order}
			<div class="mb-2">
				<OrderComponent {order} />
			</div>
		{/each}
	</div>
</section>
