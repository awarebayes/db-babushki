<script lang="ts">
	import './styles.css';
	import '../app.css';
	import Header from './Header.svelte';
	import Footer from './Footer.svelte';

	import { setTRPCToken, trpcClient } from '../lib/trpc/client';
	import { onMount } from 'svelte';
	import { jwtLoaded, loggedInUser } from '../lib/misc/singletons';
	import { authRepository } from '../lib/misc/impl_pocketbase_browser';
	import type { User } from '@prisma/client';

	let user = authRepository.getAuthenticatedUser();

	const getJwtToken = async () => {
		let token = await authRepository.getToken();
		setTRPCToken(token);
		$jwtLoaded = true;
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
