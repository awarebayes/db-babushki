<script lang="ts">
    import {onMount} from "svelte";
    import type {Grandma} from "@prisma/client";
	import { loggedInUser } from "$lib/misc/singletons";
	import { trpcClient } from "$lib/trpc/client";
    let sort_by = '-created';

    let records: Grandma[] = [];

    async function updateGrandmas() {
        records = await trpcClient.getGrandmas.query(0)! as Grandma[]; 
    }

   onMount(updateGrandmas)

</script>

<section>
    <div class="columns is-centered is-flex h-max">
        <div class="column is-half-desktop mt-7">
            <h1 class="title has-text-centered">Бабушки в вашем районе!</h1>
            <h1 class="subtitle has-text-centered">Голодным уйти будет сложно.....</h1>
            <div class="field is-flex is-align-items-center justify-center">
                <span class="label">Сортировать</span>
                <span class="m-3"> </span>
                <span class="select">
                    <select bind:value={sort_by} on:change={updateGrandmas}>
                            <option value="created">
                                created
                            </option>
                            <option value="-created">
                                -created
                            </option>
                            <option value="name">
                                name
                            </option>
                    </select>
                </span>
            </div>

            {#each records as grandma }
                <div class="box">
                    <div class="columns">
                        <div class="column is-two-fifths display-flex content-center align-middle">
                            <img src={grandma.pictureUrl} alt="grandma photo"
                                 class="rounded image is-256x256 center-image object-cover">
                        </div>
                        <div class="column">
                            <p>
                                <a class="subtitle is-3 text-blue-400"
                                   href="/grandmas/{grandma.username}">
                                    {grandma.name}
                                    {#if grandma.verified}
                                                <i class="fas text-sm fa-certificate text-yellow-400"></i>
                                    {/if}
                                </a>
                            </p>
                            <p class="icon-text">
                            <span class="icon">
                                <i class="fas fa-star text-yellow-400"></i>
                            </span>
                                <span>{grandma.rating}/5</span>

                                <span class="sep"></span>

                                <span class="icon">
                                <i class="fas fa-clock text-blue-800"></i>
                            </span>
                                <span>{grandma.timeReply} min</span>

                                <span class="sep"></span>

                            </p>
                            <p class="pt-2">{@html grandma.description}</p>
                            <div class="pt-2">
                                <span class="tag is-primary is-light">Пирожки</span>
                                <span class="tag is-link is-light">Блинчики</span>
                                <span class="tag is-info is-light">Картошка</span>
                                <span class="tag is-success is-light">Супы</span>
                                <span class="tag is-warning is-light">Хачапури</span>
                            </div>
                        </div>
                    </div>
                </div>
            {/each}
        </div>
    </div>
</section>

<style>
    .sep {
        padding-left: 5px;
        padding-right: 5px;
    }

    .center-image {
        display: block;
        margin-left: auto;
        margin-right: auto
    }

    .is-256x256 {
        width: 256px;
        height: 256px;
    }

</style>