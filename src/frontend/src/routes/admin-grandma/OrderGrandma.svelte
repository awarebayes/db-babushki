<script lang="ts">
	import { Card, Badge, Button } from 'flowbite-svelte';
	import { trpcClient } from '$lib/trpc/client';
	import type { ExpandedOrder } from '../../../../node_service/entities/generated_models';
	import { OrderStatusEnum } from '../../../../node_service/entities/models';

	export let order: ExpandedOrder;
	let order_status = order.status.name;

	let total = order.items
		.map((item) => item.meal.price * item.count)
		.reduce((acc, item) => item + acc);

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
		await trpcClient.updateOrderStatusAsGrandma.query({
			orderId: order.id,
			newStatus: OrderStatusEnum.Cancelled
		});
		order_status = 'Cancelled';
	}

	async function confirm() {
		await trpcClient.updateOrderStatusAsGrandma.query({
			orderId: order.id,
			newStatus: OrderStatusEnum.Confirmed
		});
		order_status = 'Confirmed';
	}

	async function start_cooking() {
		await trpcClient.updateOrderStatusAsGrandma.query({
			orderId: order.id,
			newStatus: OrderStatusEnum.Cooking
		});
		order_status = 'Cooking';
	}

	async function start_delivering() {
		await trpcClient.updateOrderStatusAsGrandma.query({
			orderId: order.id,
			newStatus: OrderStatusEnum.Delivering
		});
		order_status = 'Delivering';
	}

	async function complete() {
		await trpcClient.updateOrderStatusAsGrandma.query({
			orderId: order.id,
			newStatus: OrderStatusEnum.Completed
		});
		order_status = 'Completed';
	}
</script>

<Card>
	<a class="text-xl text-center text-gray-800 mb-2" href="/grandmas/{order.grandma.username}">
		Заказ от {order.user.name} ({order.user.username})</a
	>
	<h2 class="text-lg text-center text-gray-400 mb-2">{order.items.length} Позиций</h2>

	<div class="text-center mb-2">
		Статус: <Badge color="yellow">{statusToRussian(order_status)}</Badge>
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

	{#if order_status == 'Initialized'}
		<div class="text-center mt-2 mb-0">
			<Button color="red" on:click={cancel}>Отменить</Button>
		</div>
		<div class="text-center mt-2 mb-0">
			<Button color="green" on:click={confirm}>Подтвердить</Button>
		</div>
	{/if}

	{#if order_status == 'Confirmed'}
		<div class="text-center mt-2 mb-0">
			<Button color="blue" on:click={start_cooking}>Начать готовку</Button>
		</div>
	{/if}

	{#if order_status == 'Cooking'}
		<div class="text-center mt-2 mb-0">
			<Button color="blue" on:click={start_delivering}>Начать доставку</Button>
		</div>
	{/if}

	{#if order_status == 'Delivering'}
		<div class="text-center mt-2 mb-0">
			<Button color="green" on:click={complete}>Завершить</Button>
		</div>
	{/if}
</Card>
