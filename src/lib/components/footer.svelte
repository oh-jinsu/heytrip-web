<script>
  const year = new Date().getFullYear()
</script>

<footer>
  <p>© { year } 헤이트립.</p>
</footer>

<style>
  footer {
    display: flex;
    
    flex-direction: column;
    
    align-items: center;

    width: 100%;
  }

  footer>* {
    max-width: var(--screen-width);
	
    padding: 0 16px;
  }
</style>
