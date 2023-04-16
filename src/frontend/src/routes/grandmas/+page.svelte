<script lang="ts">
	import { onMount } from 'svelte';
	import type { Grandma } from '@prisma/client';
	import GrandmaEl from './Grandma.svelte';
	import { trpcClient } from '$lib/trpc/client';
	let sort_by = '-created';

	let records: Grandma[] = [];

	async function updateGrandmas() {
		records = (await trpcClient.getGrandmas.query(0)!) as Grandma[];
	}

	onMount(updateGrandmas);
</script>

<section>
	<div class="columns is-centered is-flex h-max">
		<div class="column is-half-desktop mt-7">
			<h1 class="title has-text-centered">Бабушки в вашем районе!</h1>
			<h1 class="subtitle has-text-centered">Голодным уйти будет сложно.....</h1>
			<div class="field is-flex is-align-items-center justify-center">
				<span class="label">Сортировать</span>
				<span class="m-3" />
				<span class="select">
					<select bind:value={sort_by} on:change={updateGrandmas}>
						<option value="created"> created </option>
						<option value="-created"> -created </option>
						<option value="name"> name </option>
					</select>
				</span>
			</div>

			{#each records as grandma}
				<GrandmaEl {grandma} />
			{/each}
		</div>
	</div>
</section>
