<script lang="ts">
    import MealComponent from "./meal.svelte";

    import {onMount} from "svelte";
    import {mealRepository} from "../data/singletons";

    let records = [];
    onMount(async function () {
        records = await mealRepository.getPaged(1, 50, {sort: '-created', expand: 'granny_id.user_id'});
        for (let i of records)
        {
            i.rating = Math.floor(Math.random() * 5) + 1;
            i.cooked_by = i?.expand?.granny_id?.expand?.user_id?.name;
            i.cooked_by_username = i?.expand?.granny_id?.expand?.user_id?.username;
        }
    });
</script>

<section>
    <div class="columns is-centered is-flex h-max">
        <div class="column is-half-desktop mt-7">
            <h1 class="title has-text-centered">Блюда которые готовят бабушки!</h1>
            <h1 class="subtitle has-text-centered">Голодным уйти будет сложно.....</h1>
            {#each records as m}
                <MealComponent meal={m} />
            {/each}
        </div>
    </div>
</section>
