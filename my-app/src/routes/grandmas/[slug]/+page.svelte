<script lang="ts">
    import { page } from '$app/stores';
    import {onMount} from "svelte";
    import MealComponent from "../../meals/meal.svelte";
    import {mealRepository, userRepository} from "../../data/singletons";
    import type {Meal, User} from "../../data/models";
    let username = $page.params.slug;
    let grandma: User | null = null;
    let meals: Array<Meal> = [];

    onMount(async () => {
        grandma = await userRepository.getByUsername(username);
        meals = await mealRepository.getMealsOfGrandma(grandma);
    });
</script>


<section>
    <div class="columns is-centered is-vcentered is-flex min-h-screen">
        <div class="column is-half-desktop mt-7">
            {#if grandma !== null}
            <div class="box is-flex is-flex-direction-column is-align-items-center">
                <figure class="image is-128x128 avatar" style="background-image: url('{grandma.avatar_url}')">
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
                <div>
                    <MealComponent meal={meal}/>
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