<script>
	import './styles.css';
	import "../app.css";
	import Header from "./Header.svelte";
	import Footer from "./Footer.svelte";
</script>

<div class="app h-max">
	<Header/>
	<main>
		<slot />
	</main>
	<Footer/>
</div>

