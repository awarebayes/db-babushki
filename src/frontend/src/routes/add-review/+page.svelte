<script lang="ts">
	import { trpcClient } from '$lib/trpc/client';
	import type { Grandma } from '@prisma/client';
	import { page } from '$app/stores';
	import { onMount } from 'svelte';
	import { Button, Card, Label, Radio, Textarea } from 'flowbite-svelte';

	let grandma_username: string | null = $page.url?.searchParams.get('grandma_username');
	let grandma: Grandma | null = null;

	async function get_grandma() {
		grandma = await trpcClient.getGrandmaWithUsername.query(grandma_username!);
	}

	let rating = 0;
	let review = '';

	async function submit_review() {
		rating = Number(rating);
		await trpcClient.addReview.query({ grandmaId: grandma!.id!, review, rating });
		window.location.href = '/account/orders';
	}

	onMount(get_grandma);
</script>

<section class="grid justify-center min-h-screen mt-2">
	<div>
		<h1 class="text-center text-2xl text-gray-800 mb-2">Оставить отзыв</h1>
		<h1 class="text-center text-lg text-gray-600">На бабушку: {grandma?.name}</h1>

		<div class="w-96 mt-4">
			<Card>
				<div class="mb-2">
					<Label for="textarea-id" class="mb-2">Ваш отзыв</Label>
					<Textarea
						id="textarea-id"
						placeholder="Я уже джва году жду такую бабушку"
						rows="4"
						name="message"
						bind:value={review}
					/>
				</div>

				<div class="mb-2">
					<p class="mb-2 text-gray-900 dark:text-white">Ваша оценка</p>
					<ul
						class="items-center w-full rounded-lg border border-gray-200 sm:flex dark:bg-gray-800 dark:border-gray-600 divide-x divide-gray-200 dark:divide-gray-600"
					>
						<li class="w-full">
							<Radio name="hor-list" class="p-3" bind:group={rating} value={1}>1</Radio>
						</li>
						<li class="w-full">
							<Radio name="hor-list" class="p-3" bind:group={rating} value={2}>2</Radio>
						</li>
						<li class="w-full">
							<Radio name="hor-list" class="p-3" bind:group={rating} value={3}>3</Radio>
						</li>
						<li class="w-full">
							<Radio name="hor-list" class="p-3" bind:group={rating} value={4}>4</Radio>
						</li>
						<li class="w-full">
							<Radio name="hor-list" class="p-3" bind:group={rating} value={5}>5</Radio>
						</li>
					</ul>
				</div>
				<div class="">
					<Button color="blue" on:click={submit_review}>Оставить отзыв</Button>
				</div>
			</Card>
		</div>
	</div>
</section>
