<script lang="ts">
	import "@fontsource/roboto";
	import icon from "../lib/images/icon.png"
	import {orderClient, setTRPCToken} from "../lib/trpc/client";


	import { authRepository, pb } from "../../../backend/shared/data/impl_pocketbase_browser"
	import {jwtLoaded} from "./singletons";
	let user = authRepository.getAuthenticatedUser();

	let greeting = 'TRPC not retrieved yet...';

	const loadData = async () => {
		if (!$jwtLoaded)
			return;
		greeting = await orderClient.ping.query("misha");
	};

	$: $jwtLoaded, loadData();

</script>


<section class="hero is-fullheight-with-navbar">
	<div class="hero-body is-flex is-flex-direction-column justify-center text-center">
			<p class="image is-256x256">
				<img alt="icon" src={icon}>
			</p>

			<p class="title">
				Бабушка готовит
			</p>
			<p class="subtitle">
				Социально значимый гастромаркет
				<br/>
				{greeting}
			</p>

			<div class="buttons">
				<a class="button is-primary is-light" href="/grandmas">Подобрать бабушку</a>
				<a class="button is-link is-light">Стать бабушкой</a>
			</div>
	</div>
</section>

<style>
	.is-256x256 {
		width: 256px;
	}
</style>
