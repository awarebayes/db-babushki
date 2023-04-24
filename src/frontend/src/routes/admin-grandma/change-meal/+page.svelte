<script lang="ts">
    import {page} from "$app/stores"
	import { trpcClient } from "$lib/trpc/client";
	import type { Meal } from "../../../../../node_service/entities/generated_models";
	import { Button, Fileupload, Input, Label, Textarea } from "flowbite-svelte";
	import { jwtLoaded } from "$lib/misc/singletons";
	import { imageRepository } from "$lib/misc/impl_pocketbase_browser";
    let meal_id_str: string | null = $page.url?.searchParams.get('meal_id')
    let meal_id = Number(meal_id_str)
    let meal: Meal | null = null

    let meal_name = ""
    let meal_description = ""
    let meal_image_url = ""

    async function get_meal() {
        if (!$jwtLoaded)
            return
        meal = (await trpcClient.getSingleMealOfGrandma.query(meal_id!))!
        meal_name = meal.name
        meal_description = meal.description
        meal_image_url = meal.pictureUrl
    }

    async function update() {

        if (uploaded_meal)
        {
            if (uploaded_meal.length > 1)
            {
                alert("Only 1 meal should be uploaded")
                return
            }
            meal_image_url = await imageRepository.uploadImage(uploaded_meal[0])
            console.log("url", meal_image_url)
        }
    }

    $: $jwtLoaded, get_meal()

    let uploaded_meal: FileList;
</script>

<section class="min-h-screen flex justify-center flex-row">
    <div class="max-w-4xl">

        <div class="mb-2 rounded-lg max-w-md">
            <img src="{meal_image_url}" class="rounded-lg" alt="Image">
        </div>

        <h1 class="text-2xl text-center text-gray-800">
        Change meal {meal?.name}
        </h1>
		<div class="mb-2 mt-2">
				<Label class="mb-2">Имя</Label>
				<Input type="text" bind:value={meal_name} />
		</div>
        <div class="mb-2">
            <Label for="textarea-id" class="mb-2">Описание</Label>
            <Textarea id="textarea-id" placeholder="Ваше описание для блюда" rows="4" name="message" bind:value={meal_description}/>
        </div>
        <div class="mb-2">
            <Label class="space-y-2 mb-2">
                <span>Изображение</span>
                <Fileupload bind:files={uploaded_meal}/>
            </Label>
        </div>
        <div class="">
            <Button color="green" on:click={update}>
                Обновить
            </Button>
        </div>
    </div>
</section>