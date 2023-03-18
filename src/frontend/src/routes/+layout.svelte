<script lang="ts">
	import './styles.css';
	import "../app.css";
	import Header from "./Header.svelte";
	import Footer from "./Footer.svelte";

	import {setTRPCToken} from "../lib/trpc/client";
	import {onMount} from "svelte";
	import {jwtLoaded} from "./singletons";

	let user = authRepository.getAuthenticatedUser();

	const loadData = async () => {
		let token = await authRepository.getToken();
		setTRPCToken(token);
		$jwtLoaded = true;
	};

	onMount(loadData);
</script>

<div class="app h-max">
	<Header/>
	<main>
		<slot />
	</main>
	<Footer/>
</div>

