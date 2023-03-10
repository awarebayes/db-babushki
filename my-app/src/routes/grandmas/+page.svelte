<script lang="ts">
    import {onMount} from "svelte";
    import {userRepository} from "../data/singletons";
    import type {User} from "../data/models";

    let sort_by = '-created';

    let records: Array<User> = [];

    async function updateGrandmas() {
        records = await userRepository.getPaged(1, 5, {filter: 'grandma_id != null', sort: sort_by});
        for (let i of records) {
            i.rating = Math.floor(Math.random() * 5) + 1;
            i.time_reply = Math.floor(Math.random() * 50) + 5;
        }
    }

    onMount(updateGrandmas);
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
                        <div class="column is-two-fifths has-text-centered">
                            <img src={grandma.avatar_url} alt="grandma photo"
                                 class="rounded image is-256x256 center-image">
                        </div>
                        <div class="column">
                            <p>
                                <a class="subtitle is-3 text-blue-400"
                                   href="/grandmas/{grandma.username}">{grandma.name}</a>
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
                                <span>{grandma.time_reply} min</span>

                                <span class="sep"></span>

                                {#if grandma.verified_ours}
                            <span class="icon">
                                <i class="fas fa-certificate text-pink-400"></i>
                            </span>
                                    <span>Подтвержденная бабушка</span>
                                {/if}

                            </p>
                            <p class="pt-2">{@html grandma.description}</p>
                            <div class="pt-2">
                                <span class="tag is-primary is-light">Пирожки</span>
                                <span class="tag is-link is-light">Блинчики</span>
                                <span class="tag is-info is-light">Картошка</span>
                                <span class="tag is-success is-light">Супы</span>
                                <span class="tag is-warning is-light">Хачапури</span>
                                <span class="tag is-danger is-light">Торты</span>
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
    }

</style>