<script lang="ts">
    import { page } from '$app/stores';
    import {onMount} from "svelte";
    import MealComponent from "../../meals/meal.svelte";
    import type {Meal, Grandma} from "@prisma/client";
	import { trpcClient } from '$lib/trpc/client';
	import { fileServerUrl, jwtLoaded } from '$lib/misc/singletons';
	import type { FrontEndMealClaim } from '$lib/misc/types';
    let username = $page.params.slug;
    let grandma: Grandma | null = null;
    let meals: Array<FrontEndMealClaim> = [];

    const loadGrandma = (async () => {
        if (!$jwtLoaded)
            return;
        grandma = await trpcClient.getGrandmaWithUsername.query(username);
        if (!grandma)
            throw "Grandma not found";
        
        let maybeMeals = await trpcClient.getMealsOfGrandma.query(grandma.id) ;
        if (!maybeMeals)
            throw "Meals not found";
        
        meals = maybeMeals.map((el)=> {
            return {meal: el, mealId: el.id, count: 0} as FrontEndMealClaim
        });
    });

    $: $jwtLoaded, loadGrandma();

</script>


<section>
    <div class="columns is-centered is-vcentered is-flex min-h-screen">
        <div class="column is-half-desktop mt-7">
            {#if grandma !== null}
            <div class="box is-flex is-flex-direction-column is-align-items-center">
                <figure class="image is-128x128 avatar" style="background-image: url('{fileServerUrl}{grandma.pictureUrl}')">
                </figure>
                <div class="title pt-2 is-3">{grandma.name}</div>
                <div class="subtitle is-5">@{grandma.username}</div>
                <div class="box has-text-centered is-shadowless border-t-2 border-t-gray-200 rounded-t-none">
                    {@html grandma.description}
                </div>
            </div>

            <h1 class="title has-text-centered">
                Бабушкины блюда
            </h1>

            {#each meals as meal}
                <div>
                    <MealComponent mealClaim={meal}/>
                </div>
                <br/>
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