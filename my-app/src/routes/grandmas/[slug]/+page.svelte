<script>
    import { page } from '$app/stores';
    import {pb} from "../../singletons.js";
    import {onMount} from "svelte";
    import Meal from "../../meals/meal.svelte";
    let username = $page.params.slug;
    let grandma = null;
    let meals = [];

    async function updateGrandma () {
        grandma = await pb.collection('users').getFirstListItem(`username="${username}"`);
        grandma.url = pb.getFileUrl(grandma, grandma.avatar, {'thumb': '128x128'});
        const granny_id = grandma.grandma_id;
        let fetched_meals = await pb.collection('meals').getList(1, 50, {filter: `granny_id="${granny_id}"`});
        meals = fetched_meals.items;
        for (let i of meals)
        {
            i.url = pb.getFileUrl(i, i.picture, {'thumb': '256x256'});
            i.rating = Math.floor(Math.random() * 5) + 1;
            i.cooked_by = grandma.name;
        }
    }
    onMount(updateGrandma);

</script>


<section>
    <div class="columns is-centered is-vcentered is-flex min-h-screen">
        <div class="column is-half-desktop is-two-fifths-fullhd mt-7">
            {#if grandma !== null}
            <div class="box is-flex is-flex-direction-column is-align-items-center">
                <figure class="image is-128x128 avatar" style="background-image: url('{grandma.url}')">
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

            {#each meals as meal }
                <Meal meal={meal}/>
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