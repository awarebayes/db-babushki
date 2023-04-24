<script lang="ts">
	import { trpcClient } from '$lib/trpc/client';
	import type { Grandma } from '@prisma/client';
	import { Accordion } from 'flowbite-svelte';
	import GetAllPaged from './GetAllPaged.svelte';
	import CreateDummy from './CreateDummy.svelte';
	import GetByUsername from './GetByUsername.svelte';
	import Delete from './Delete.svelte';
	import Verify from './Verify.svelte';
	import GetUnverified from './GetUnverified.svelte';
</script>

<div class="max-w-screen">
	<Accordion>
		<GetAllPaged />
		<CreateDummy />
		<GetByUsername />
		<GetUnverified />
		<Verify />
		<Delete />
	</Accordion>
</div>
