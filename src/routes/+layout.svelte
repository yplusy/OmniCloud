<script>
	import favicon from '$lib/assets/favicon.svg';
	import Navbar from '$lib/components/Navbar.svelte';
	import './layout.css';

	let { children, data } = $props();
</script>

<svelte:head><link rel="icon" href={favicon} /></svelte:head>

<div class="flex h-dvh w-dvw flex-col overflow-hidden">
	<!-- 导航栏：flex-none 确保高度不被压缩 -->
	<nav class="flex-none p-4">
		<Navbar {data} />
	</nav>
	<!-- 主内容盒子：flex-1 自动填满剩余高度，overflow-y-auto 独立滚动 -->
	<main class="flex-1 overflow-y-auto p-6">
		{@render children()}
	</main>
</div>
