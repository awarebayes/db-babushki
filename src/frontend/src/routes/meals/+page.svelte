<script lang="ts">
	import MealComponent from './meal.svelte';

	import { trpcClient } from '../../lib/trpc/client';
	import type { FrontEndMealClaim } from '$lib/misc/types';
	import { onMount } from 'svelte';
	import { page } from '$app/stores';
	import { Button } from 'flowbite-svelte';

	let	page_str = $page.url?.searchParams.get('page') || "0";
	let page_num = 0;

	let records: FrontEndMealClaim[] = [];
	async function loadMeals(newPage: number | null) {
		if (newPage === null)
			page_num = Number(page_str);
		else
			page_num = newPage
		let maybeMeals = await trpcClient.getMeals.query({page: page_num}); // todo, pagination
		if (!maybeMeals) throw 'No meals retrieved!';

		records = maybeMeals.map((el) => {
			return { meal: el, mealId: el.id, count: 0 } as FrontEndMealClaim;
		});
	}

	let pages: {name: number, href: string}[] = [];

	function update_page(newPage: number) {
		page_str = newPage.toString()
		page_num = newPage
		loadMeals(newPage)
	}

	$: { 
		pages = []
		let start = Math.max(page_num - 2, 0)
		let end = page_num + 2

		for (let i = start; i <= end; ++i)
			pages.push({name: i, href: `/meals?page=${i}`})
		pages=pages
	}

	onMount(()=>loadMeals(null));

</script>

<section>
	<div class="columns is-centered is-flex min-h-screen">
		<div class="column is-half-desktop mt-7">
			<h1 class="title has-text-centered">Блюда которые готовят бабушки!</h1>
			<h1 class="subtitle has-text-centered">Голодным уйти будет сложно.....</h1>
			{#each records as m}
				<MealComponent meal={m.meal} />
			{:else}
				<p class="text-center">
					Блюд не найдено :(
					<br>
					Попробуйте другую страницу
				</p>
			{/each}
			
			<h1 class="text-base text-center mt-4">Текущая страница {page_num}</h1>
			<div class="grid justify-center mt-2">
				<div class="flex justify-center gap-2">
					{#each pages as page}
						<Button color="alternative" href="{page?.href}" on:click={()=>update_page(page?.name)}>{page?.name}</Button>
					{/each}
				</div>
			</div>
		</div>
	</div>
</section>
