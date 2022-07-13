<script lang="ts">
	import { page } from '$app/stores';

	const origin = $page.url.origin;

	const url = $page.url.toString();

	const TITLE = '헤이트립 Heytrip';

	export let title = '';

	export let description = '';

  export let keywords: string[] = []

	export let thumbnail = `${origin}/hanriver.jpg`;

	export let noindex = false;
</script>

<svelte:head>
  {#if noindex}
    <meta name="robots" content="noindex" />
  {/if}
	<title>{title ? `${title} - ${TITLE}` : TITLE}</title>
	{#if description}
		<meta name="description" content={description} />
	{/if}
  {#if keywords.length > 0}
    <meta name="keywords" content={keywords.join(", ")} />
  {/if}
	<meta name="language" content="Korean" />
	<link rel="canonical" href={url} />
	<meta property="og:title" content={title} />
	<meta property="og:description" content={description} />
	<meta property="og:url" content={url} />
	{#if thumbnail}
		<meta property="og:image" content={thumbnail} />
	{/if}
	<meta property="og:type" content="website" />
	<meta name="twitter:title" content={title} />
	<meta name="twitter:description" content={description} />
	{#if thumbnail}
		<meta name="twitter:image" content={thumbnail} />
		<meta name="twitter:card" content="summary_large_image" />
	{/if}
</svelte:head>
