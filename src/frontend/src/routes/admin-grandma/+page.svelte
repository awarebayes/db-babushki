<script lang="ts">
	import { jwtLoaded } from '$lib/misc/singletons';
	import { trpcClient } from '$lib/trpc/client';
	import type { ExpandedOrder } from '../../../../node_service/entities/generated_models';
	import AccountUpdate from './AccountUpdate.svelte';
	import MealsAdmin from './MealsAdmin.svelte';
	import OrderGrandma from './OrderGrandma.svelte';
	import { Tabs, TabItem } from 'flowbite-svelte';

	let orders: ExpandedOrder[] = [];

	async function get_orders() {
		if (!$jwtLoaded) return;
		orders = await trpcClient.getOrdersForGrandma.query();
	}
	$: $jwtLoaded, get_orders();
</script>

<section class="grid justify-center">
	<h1 class="text-center text-2xl text-gray-500 mb-2">Кабинет бабушки</h1>
	<div>
		<Tabs>
			<TabItem open title="Заказы">
				<div class="grid md:grid-cols-3 md:gap-3">
					{#each orders as order}
						<div class="mb-4">
							<OrderGrandma {order} />
						</div>
					{/each}
				</div>
			</TabItem>
			<TabItem title="Обновить профиль">
				<div class="">
					<AccountUpdate />
				</div>
			</TabItem>
			<TabItem title="Мои блюда">
				<div class="">
					<MealsAdmin />
				</div>
			</TabItem>
		</Tabs>
	</div>
</section>
