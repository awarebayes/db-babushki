<script lang="ts">
	import { authRepository } from '$lib/misc/impl_pocketbase_browser';
	import { jwtLoaded } from '$lib/misc/singletons';
	import { trpcClient } from '$lib/trpc/client';
	import type { Grandma } from '@prisma/client';
	import { AccordionItem, Accordion, Button, Label, Input } from 'flowbite-svelte';

	let get_page: number = 0;
	let created_user_text: string = '{}';
	let token: string = '';

	let who_am_i_result: string = '';

	async function who_am_i() {
		who_am_i_result = JSON.stringify(await trpcClient.whoAmI.query(), null, 2);
	}

	async function create_dummy_user() {
		let user = await trpcClient.createDummyUser.query();
		created_user_text = JSON.stringify(user, null, 2);
	}

	async function get_token() {
		token = await authRepository.getToken();
	}
</script>

<div class="max-w-screen">
	<Accordion>
		<AccordionItem>
			<span slot="header">Create dummy</span>

			<div class="mb-2">
				<Button on:click={create_dummy_user}>Create</Button>
			</div>

			<div class="mb-2 max">
				<pre class="overflow-auto max-w-6xl">
{created_user_text}
                </pre>
			</div>
		</AccordionItem>

		<AccordionItem>
			<span slot="header">Who Am I?</span>

			<div class="mb-2">
				<Button on:click={who_am_i}>Get</Button>
			</div>

			<div class="mb-2">
				<pre class="overflow-auto max-w-6xl text-left">
{who_am_i_result}
                </pre>
			</div>
		</AccordionItem>

		<AccordionItem>
			<span slot="header">Show JWT</span>

			<div class="mb-2">
				<Button on:click={get_token}>Get</Button>
			</div>

			<div class="mb-2">
				<pre class="overflow-auto max-w-6xl text-left">
{token}
                </pre>
			</div>
		</AccordionItem>
	</Accordion>
</div>
