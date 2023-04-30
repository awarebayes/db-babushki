<script lang="ts">
	import { page } from '$app/stores';
	import { trpcClient } from '$lib/trpc/client';
	import type { Meal } from '../../../../../node_service/entities/generated_models';
	import { Button, Alert, Fileupload, Input, Label, Textarea } from 'flowbite-svelte';
	import type { MealUpdateClaim } from '../../../../../node_service/entities/models';
	import { onMount } from 'svelte';
	import { jwtLoaded } from '$lib/misc/singletons';
	let meal_id_str: string | null = $page.url?.searchParams.get('meal_id');
	let meal_id = Number(meal_id_str);
	let meal: Meal | null = null;

	let meal_name = '';
	let meal_description = '';
	let meal_image_url = '';
	let meal_price: number = 0;

	let show_success_alert = false;

	async function get_meal() {
		meal = (await trpcClient.getSingleMealOfGrandma.query(meal_id!))!;
		meal_name = meal.name;
		meal_description = meal.description;
		meal_image_url = meal.pictureUrl;
		meal_price = meal.price;
	}

	async function update() {
		show_success_alert = false;
		meal_price = Number(meal_price);
		if (uploaded_meal) {
			if (uploaded_meal.length > 1) {
				alert('Only 1 meal should be uploaded');
				return;
			}

			let post_image_data = await trpcClient.getUploadImageUrl.query(uploaded_meal[0].name);

			await fetch(post_image_data.url, {
				method: 'PUT',
				body: uploaded_meal[0]
			});
			meal_image_url = `http://minio1:9000/images/${post_image_data.name}`;
		}

		let updateClaim: MealUpdateClaim = {
			mealId: meal?.id,
			name: meal_name,
			description: meal_description,
			price: meal_price,
			pictureUrl: meal_image_url
		};
		await trpcClient.updateMeal.query(updateClaim);
		show_success_alert = true;
	}

	$: if($jwtLoaded) get_meal()

	let uploaded_meal: FileList;
</script>

<section class="min-h-screen flex justify-center flex-row">
	<div class="max-w-4xl">
		<div class="mb-2 rounded-lg max-w-md">
			<img src={meal_image_url} class="rounded-lg" alt="Image" />
		</div>

		<h1 class="text-2xl text-center text-gray-800">
			Обновить блюдо: {meal_name}
		</h1>
		<div class="mb-2 mt-2">
			<Label class="mb-2">Имя</Label>
			<Input type="text" bind:value={meal_name} />
		</div>
		<div class="mb-2 mt-2">
			<Label class="mb-2">Цена</Label>
			<Input type="number" bind:value={meal_price} />
		</div>
		<div class="mb-2">
			<Label for="textarea-id" class="mb-2">Описание</Label>
			<Textarea
				id="textarea-id"
				placeholder="Ваше описание для блюда"
				rows="4"
				name="message"
				bind:value={meal_description}
			/>
		</div>
		<div class="mb-2">
			<Label class="space-y-2 mb-2">
				<span>Изображение</span>
				<Fileupload bind:files={uploaded_meal} accept="image/png, image/jpeg" />
			</Label>
		</div>
		<div class="">
			<Button color="green" on:click={update}>Обновить</Button>
		</div>

		{#if show_success_alert}
			<div class="mt-4">
				<Alert color="green">
					<span class="font-medium">Успех!</span> блюдо было успешно обновлено
				</Alert>
			</div>
		{/if}
	</div>
</section>
