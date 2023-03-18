<script lang="ts">
    import MealComponent from "./meal.svelte";

    import {onMount} from "svelte";

    let records: Array<Meal> = [];
    onMount(async function () {
        records = await mealRepository.getPaged(1, 50, {sort: '-created'});
    });
</script>

<section>
    <div class="columns is-centered is-flex h-max">
        <div class="column is-half-desktop mt-7">
            <h1 class="title has-text-centered">Блюда которые готовят бабушки!</h1>
            <h1 class="subtitle has-text-centered">Голодным уйти будет сложно.....</h1>
            {#each records as m}
                <MealComponent meal={m}/>
            {/each}
        </div>
    </div>
</section>
