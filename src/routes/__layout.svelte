<script>
	import Footer from '$lib/components/footer.svelte';
import Header from '$lib/components/header.svelte';

	import '../app.css';
</script>

<Header />
<main>
	<slot />
</main>
<Footer />

<style>
	main {
		display: flex;

		flex-direction: column;

		max-width: var(--screen-width);

		width: 100%;

		padding: 16px;
	}
</style>
