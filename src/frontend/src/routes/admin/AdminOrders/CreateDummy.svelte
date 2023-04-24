<script lang="ts">
	import { trpcClient } from '$lib/trpc/client';
	import { AccordionItem, Button} from 'flowbite-svelte';

	let created_order_text: string = '{}';
	async function create_dummy_order() {
		let order = await trpcClient.createDummyOrderForAdmin.query();
		created_order_text = JSON.stringify(order, null, 2);
	}

</script>


<AccordionItem>
    <span slot="header">Create dummy</span>
    <div class="mb-2">
        <Button on:click={create_dummy_order}>Create</Button>
    </div>

    <div class="mb-2 max">
        <pre class="overflow-auto max-w-6xl">
{created_order_text}
        </pre>
    </div>
</AccordionItem>
