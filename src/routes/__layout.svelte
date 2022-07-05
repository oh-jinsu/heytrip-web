<script>
import Footer from "$lib/components/footer.svelte";

  import "../app.css"
</script>

<main>
  <slot />
</main>
<Footer />

<style >
  main {
    display: flex;

    flex-direction: column;
    
    max-width: var(--screen-width);

    padding: 16px;
  }
</style>