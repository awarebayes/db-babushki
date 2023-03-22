<script lang="ts">
    import MealComponent from "./meal.svelte";

    import {trpcClient} from "../../lib/trpc/client";
	import { jwtLoaded } from "$lib/misc/singletons";
	import type { FrontEndMealClaim } from "$lib/misc/types";

    let records: FrontEndMealClaim[] = [];
    async function loadMeals () {
        let maybeMeals = await trpcClient.getMeals.query(0);
        if (!maybeMeals)
            throw "No meals retrieved!"

        records = maybeMeals.map((el)=> {
            return {meal: el, mealId: el.id, count: 0} as FrontEndMealClaim
        });
    }

    $: $jwtLoaded, loadMeals()
</script>

<section>
    <div class="columns is-centered is-flex min-h-screen">
        <div class="column is-half-desktop mt-7">
            <h1 class="title has-text-centered">Блюда которые готовят бабушки!</h1>
            <h1 class="subtitle has-text-centered">Голодным уйти будет сложно.....</h1>
            {#each records as m}
                <MealComponent mealClaim={m}/>
            {/each}
        </div>
    </div>
</section>
