<script lang="ts">
	import { page } from '$app/stores';
	import { trpcClient } from '$lib/trpc/client';
	import type { Meal } from '../../../../../node_service/entities/generated_models';
	import { Button, Alert, Fileupload, Input, Label, Textarea } from 'flowbite-svelte';
	import type { MealUpdateClaim } from '../../../../../node_service/entities/models';
	let meal: Meal | null = null;

	let meal_name = 'Оладушки от бабушки';
	let meal_description = 'Самые вкусные оладушки.';
	let meal_price: number = 123;

	let show_success_alert = false;

	async function create() {
		show_success_alert = false;
		meal_price = Number(meal_price);

		if (!uploaded_meal || uploaded_meal.length != 1) {
			alert('One meal picture should be uploaded');
			return;
		}

		let post_image_data = await trpcClient.getUploadImageUrl.query(uploaded_meal[0].name);

		await fetch(post_image_data.url, {
			method: 'PUT',
			body: uploaded_meal[0]
		});
		let meal_image_url = `http://minio1:9000/images/${post_image_data.name}`;

		let updateClaim: MealUpdateClaim = {
			mealId: meal?.id,
			name: meal_name,
			description: meal_description,
			price: meal_price,
			pictureUrl: meal_image_url
		};
		await trpcClient.createMeal.query(updateClaim);
		show_success_alert = true;
		window.location = '/admin-grandma';
	}

	let uploaded_meal: FileList;
</script>

<section class="min-h-screen flex justify-center flex-row">
	<div class="max-w-4xl">
		<h1 class="text-2xl text-center text-gray-800">
			Создать блюдо: {meal_name}
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
			<Button color="green" on:click={create}>Создать</Button>
		</div>
	</div>
</section>
