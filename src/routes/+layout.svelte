<script>
	import favicon from '$lib/assets/favicon.svg';
	import Navbar from '$lib/components/Navbar.svelte';
	import './layout.css';

	/** @type {{children: import('svelte').Snippet,data: import('./$types').LayoutData}} */
	let { children, data } = $props();
</script>

<svelte:head><link rel="icon" href={favicon} /></svelte:head>

<div class="flex min-h-dvh flex-col">
	<Navbar {data} />
	<main class="mx-auto flex w-full max-w-4xl flex-1 flex-col p-4">
		{@render children()}
	</main>
</div>
