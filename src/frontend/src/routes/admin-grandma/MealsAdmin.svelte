<script lang="ts">
	import type { Meal } from "../../../../node_service/entities/generated_models";
	import { trpcClient } from "$lib/trpc/client";
	import { Button, Card } from "flowbite-svelte";
	import MealAdmin from "./MealAdmin.svelte";
	import { onMount } from "svelte";

    let meals: Meal[] = []

    async function get_meals() {
        let user = await trpcClient.whoAmI.query()
        let grandma = await trpcClient.getGrandmaWithUsername.query(user?.username!)
        meals = await trpcClient.getMealsOfGrandma.query(grandma?.id!)
    }

    onMount(get_meals)
</script>

<div>
    <div class="text-center mb-4 mt-2">
        <Button color="green">
            + Новое блюдо
        </Button>
    </div>

    <h2 class="text-center text-lg text-gray-500 mb-2">
        Ваши блюда
    </h2>

    {#each meals as meal}
        <div class="mb-2">
            <MealAdmin {meal}/>       
        </div>
    {/each}
</div>
