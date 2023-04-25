<script lang="ts">
	import { Card, Badge, Button } from 'flowbite-svelte';
	import type { ExpandedOrder } from '../../../../../node_service/entities/generated_models';
	import { trpcClient } from '$lib/trpc/client';
	export let order: ExpandedOrder;
	let total = order.items
		.map((item) => item.meal.price * item.count)
		.reduce((acc, item) => item + acc);

	let order_status_name = order.status.name;

	function statusToRussian(status: string) {
		if (status === 'Initialized') return 'Принят в обработку';
		else if (status == 'Confirmed') return 'Подтвержден бабушкой';
		else if (status == 'Cooking') return 'Готовится';
		else if (status == 'Delivering') return 'Доставляется';
		else if (status == 'Completed') return 'Завершен';
		else if (status == 'Cancelled') return 'Отменен';
		return `Неизвестный статус: ${status}`;
	}

	async function cancel() {
		await trpcClient.cancelOrder.query(order.id);
		order_status_name = 'Cancelled';
		can_cancel = false;
	}
</script>

<Card>
	<a class="text-xl text-center text-gray-800 mb-2" href="/grandmas/{order.grandma.username}">
		Заказ у {order.grandma.name} ({order.grandma.username})</a
	>
	<h2 class="text-lg text-center text-gray-400 mb-2">{order.items.length} Позиций</h2>

	<div class="text-center mb-2">
		Статус: <Badge color="yellow">{statusToRussian(order.status.name)}</Badge>
	</div>

	<ul class="mb-2">
		{#each order.items as item}
			<li class="text-center">
				{item.meal.name} - {item.meal.price} руб - {item.count} шт
			</li>
		{/each}
	</ul>

	<div class="text-center text-gray-800">
		Итого: {total} руб
	</div>

	{#if order_status_name == 'Initialized'}
		<div class="text-center mt-2 mb-0">
			<Button color="red" on:click={cancel}>Отменить</Button>
		</div>
	{/if}

	{#if order_status_name == 'Completed'}
		<div class="text-center mt-2 mb-0">
			<Button color="yellow" href="/add-review?grandma_username={order.grandma.username}"
				>Оставить отзыв</Button
			>
		</div>
	{/if}
</Card>
