<script lang="ts">
	import { fileServerUrl } from "$lib/misc/singletons";
    import type { Grandma } from "@prisma/client";
    export let grandma: Grandma;
</script>

<div class="box">
    <div class="columns">
        <div class="column is-two-fifths display-flex content-center align-middle">
            <img src="{fileServerUrl}{grandma.pictureUrl}" alt="grandma photo"
                    class="rounded image is-256x256 center-image object-cover">
        </div>
        <div class="column">
            <p class="mb-3 flex flex-row items-center">
                <a class="subtitle is-3 text-blue-400 mb-0 mr-3"
                    href="/grandmas/{grandma.username}">
                    {grandma.name}
                </a>
                {#if grandma.verified}
                            <i class="fas fa-certificate text-yellow-400"></i>
                {/if}
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