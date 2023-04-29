<script lang="ts">
	import { trpcClient } from '$lib/trpc/client';
	import { Card, Spinner } from 'flowbite-svelte';
	import { Tabs, TabItem } from 'flowbite-svelte';
	import AdminGrandmas from './AdminGrandmas/AdminGrandmas.svelte';
	import AdminUsers from './AdminUsers.svelte';
	import AdminMeals from './AdminMeals/AdminMeals.svelte';
	import Cart from '../Cart/Cart.svelte';
	import AdminOrders from './AdminOrders/AdminOrders.svelte';

	let iAmAdmin = false;

	async function checkIfAdmin() {
		iAmAdmin = await trpcClient.amIAdmin.query();
		if (!iAmAdmin) {
			window.location.href = '/admin/authFail';
		}
	}

	$: checkIfAdmin();
</script>

<section class="min-h-screen grid justify-center mt-2">
	{#if !iAmAdmin}
		<Spinner />
	{:else}
		<div class="transition-width">
			<Tabs>
				<TabItem open title="Grandmas">
					<AdminGrandmas />
				</TabItem>
				<TabItem title="Meals">
					<AdminMeals />
				</TabItem>
				<TabItem title="Users">
					<AdminUsers />
				</TabItem>
				<TabItem title="Orders">
					<AdminOrders />
				</TabItem>
			</Tabs>
		</div>
	{/if}
</section>
