<script>
    import {pb} from "../singletons.js";
    import Meal from "./meal.svelte";
    import {onMount} from "svelte";

    let records = [];
    onMount(async function () {
        let meals = await pb.collection('meals').getList(1, 50, {sort: '-created', expand: 'granny_id.user_id'});
        records = meals.items;
        console.log(records);
        for (let i of records)
        {
            i.url = pb.getFileUrl(i, i.picture, {'thumb': '256x256'});
            i.rating = Math.floor(Math.random() * 5) + 1;
            i.cooked_by = i?.expand?.granny_id?.expand?.user_id?.name;
        }
    });


</script>

<section>
    <div class="columns is-vcentered is-flex h-max">
        <div class="column is-half is-offset-one-quarter mt-7">
            <h1 class="title has-text-centered">Блюда которые готовят бабушки!</h1>
            <h1 class="subtitle has-text-centered">Голодным уйти будет сложно.....</h1>
            {#each records as m}
                <Meal meal={m}></Meal>
            {/each}
        </div>
    </div>
</section>
