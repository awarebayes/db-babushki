<script lang="ts">
	import './styles.css';
	import '../app.css';
	import Header from './Header.svelte';
	import Footer from './Footer.svelte';

	import { setTRPCToken, trpcClient } from '../lib/trpc/client';
	import { onMount } from 'svelte';
	import { loggedInUser } from '../lib/misc/singletons';
	import type { User } from '@prisma/client';


	const getJwtToken = async () => {
		let token =  localStorage.getItem("jwt");
		if (!token)
			return;
		setTRPCToken(token);
		await fetchUser();
	};

	const fetchUser = async () => {
		let maybeLoggedInUser = await trpcClient.whoAmI.query();
		console.log('logged in user', maybeLoggedInUser);
		if (!maybeLoggedInUser) return;
		$loggedInUser = maybeLoggedInUser as User;
	};

	onMount(getJwtToken);
</script>

<div class="app h-max">
	<Header />
	<main>
		<slot />
	</main>
	<Footer />
</div>
