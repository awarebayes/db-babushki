<script lang="ts">
	import { trpcClient } from '$lib/trpc/client';
	import { Button } from 'flowbite-svelte';
	import { onMount } from 'svelte';

	let i_am_grandma = false;

	onMount(async () => {
		i_am_grandma = await trpcClient.amIGrandma.query();
	});

	async function become_grandma() {
		await trpcClient.createGrandma.query();
		window.location.href = '/admin-grandma';
	}
</script>

<section>
	<div class="columns is-centered is-flex min-h-screen">
		<div class="column is-half-desktop mt-7">
			{#if i_am_grandma}
				<h1 class="title has-text-centered">Вы уже бабушка...</h1>
			{:else}
				<h1 class="title has-text-centered">Стать бабушкой</h1>
				<h1 class="subtitle has-text-centered">
					Тут вы сможете сами попробовать себя в роли бабушки!
				</h1>
				<div class="mx-auto text-center">
					<Button color="green" on:click={become_grandma}>Стать бабушкой</Button>
				</div>
			{/if}
		</div>
	</div>
</section>
