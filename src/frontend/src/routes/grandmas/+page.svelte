<script lang="ts">
	import { onMount } from 'svelte';
	import type { Grandma } from '@prisma/client';
	import GrandmaEl from './Grandma.svelte';
	import { trpcClient } from '$lib/trpc/client';
	import { page } from '$app/stores';
	import { Button, Pagination } from 'flowbite-svelte'


	let	page_str = $page.url?.searchParams.get('page') || "0";
	let page_num = 0;
	let records: Grandma[] = [];

	async function updateGrandmas(newPage: number | null) {
		if (newPage === null)
			page_num = Number(page_str);
		else
			page_num = newPage
		records = (await trpcClient.getGrandmas.query(page_num)!) as Grandma[];
	}

	let pages: {name: number, href: string}[] = [];

	function update_page(newPage: number) {
		page_str = newPage.toString()
		page_num = newPage
		updateGrandmas(newPage)
	}

	$: { 
		pages = []
		let start = Math.max(page_num - 2, 0)
		let end = page_num + 2

		for (let i = start; i <= end; ++i)
			pages.push({name: i, href: `/grandmas?page=${i}`})
		pages=pages
	}

	onMount(()=>updateGrandmas(null));
</script>

<section>
	<div class="columns is-centered is-flex h-max">
		<div class="column is-half-desktop mt-7">
			<h1 class="title has-text-centered">Бабушки в вашем районе!</h1>
			<h1 class="subtitle has-text-centered">Голодным уйти будет сложно.....</h1>

			<div>
				{#each records as grandma}
					<GrandmaEl {grandma} />
				{:else}
					<p class="text-center text-xl"> 
					Бабушек не найдено :( 
					<br>	
					Попробуйте зайти на другую страницу
					</p>
				{/each}
			</div>


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
