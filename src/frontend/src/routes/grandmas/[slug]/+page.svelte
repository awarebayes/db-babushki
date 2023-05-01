<script lang="ts">
	import { page } from '$app/stores';
	import MealComponent from '../../meals/meal.svelte';
	import type { Meal, Grandma } from '@prisma/client';
	import { trpcClient } from '$lib/trpc/client';
	import { fileServerUrl } from '$lib/misc/singletons';
	import type { FrontEndMealClaim } from '$lib/misc/types';
	import { RatingComment, Rating } from 'flowbite-svelte';
	import { onMount } from 'svelte';
	let username = $page.params.slug;
	let grandma: Grandma | null = null;
	let meals: Array<FrontEndMealClaim> = [];

	type Comment = {
		id: string;
		user: {
			name: string;
			img: {
				src: string;
				alt: string;
			};
			joined: string;
		};
		total: number;
		rating: number;
		heading: string;
		address: string;
		datetime: string;
		text: string;
	};

	let comments: Comment[] = [];

	async function load_comments() {
		let reviews = await trpcClient.getReviewsForGrandma.query(username);

		comments = reviews
			.map((review) => {
				let c: Comment = {
					id: review.id.toString(),
					user: {
						name: review.user.name,
						img: {
							src: `https://i.pravatar.cc/300?random=${Math.random()}`,
							alt: 'user pfp'
						},
						joined: 'Changeme'
					},
					total: 5,
					rating: review.rating,
					heading: '',
					address: '',
					datetime: '',
					text: review.review
				};
				return c;
			})
			.slice(0, 3);
	}

	const loadGrandma = async () => {
		grandma = await trpcClient.getGrandmaWithUsername.query(username);
		if (!grandma) throw 'Grandma not found';

		let maybeMeals = await trpcClient.getMealsOfGrandma.query(grandma.id);
		if (!maybeMeals) throw 'Meals not found';

		meals = maybeMeals.map((el) => {
			return { meal: el, mealId: el.id, count: 0 } as FrontEndMealClaim;
		});
	};

	onMount(async ()=> { load_comments(), loadGrandma()});

</script>

<section>
	<div class="columns is-centered is-vcentered is-flex min-h-screen">
		<div class="column is-half-desktop mt-7">
			{#if grandma !== null}
				<div class="box is-flex is-flex-direction-column is-align-items-center">
					<figure
						class="image is-128x128 avatar"
						style="background-image: url('{fileServerUrl}{grandma.pictureUrl}')"
					/>
					<div class="pt-2 text-2xl text-gray-700 pb-2">{grandma.name}</div>
					<div class="text-xl text-gray-600 text-center pb-2">@{grandma.username}</div>
					<div class="pb-2 flex">
						<Rating total={5} rating={grandma.rating}/> 
						<span class="text-lg">
 							/ {grandma.rating.toFixed(2)}
						</span>
					</div>
					<div
						class="box has-text-centered is-shadowless border-t-2 border-t-gray-200 rounded-t-none"
					>
						{@html grandma.description}
					</div>
				</div>

				{#if comments.length > 0}
					<h1 class="text-center text-2xl mb-2">Отзывы на бабушку</h1>
					{#each comments as comment}
						<div class="mb-4">
							<RatingComment {comment} helpfullink="/" abuselink="/">
								<p class="mb-2 font-light text-gray-500 dark:text-gray-400">
									{comment.text}
								</p>
								<svelte:fragment slot="evaluation"
									>{Math.floor(Math.random() * 50)} people found this helpful</svelte:fragment
								>
							</RatingComment>
						</div>
					{/each}
				{/if}

				<h1 class="title has-text-centered">Бабушкины блюда</h1>

				{#each meals as meal}
					<div>
						<MealComponent meal={meal.meal} />
					</div>
					<br />
				{/each}
			{:else}
				<h1 class="has-text-centered title">Бабушка не найдена:(</h1>
			{/if}
		</div>
	</div>
</section>

<style>
	.avatar {
		background-size: cover;
		width: 128px;
		height: 128px;
		border-radius: 50%;
	}
</style>
