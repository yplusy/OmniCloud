<script>
	import { page } from '$app/state';
	import { Cog, HardDrive, LayoutDashboard, UserRoundCog } from '@lucide/svelte';
	import { Sidebar, SidebarButton, SidebarGroup, SidebarItem, uiHelpers } from 'flowbite-svelte';
	const sidebar = uiHelpers();
	let { children } = $props();
</script>

<SidebarButton onclick={sidebar.toggle} class="mb-2" />
<div class="relative">
	<Sidebar
		activeUrl={page.url.pathname}
		backdrop={false}
		isOpen={sidebar.isOpen}
		closeSidebar={sidebar.close}
		params={{ x: -50, duration: 50 }}
		class="z-50 h-full"
		position="absolute"
		classes={{ nonactive: 'p-2', active: 'p-2' }}
	>
		<SidebarGroup>
			<SidebarItem label="仪表板" href="/dash">
				{#snippet icon()}
					<LayoutDashboard />
				{/snippet}
			</SidebarItem>
			<SidebarItem label="存储管理" href="/dash/storage">
				{#snippet icon()}
					<HardDrive />
				{/snippet}
			</SidebarItem>
			<SidebarItem label="账号管理" href="/dash/accounts">
				{#snippet icon()}
					<UserRoundCog />
				{/snippet}
			</SidebarItem>
			<SidebarItem label="系统设置" href="/dash/settings">
				{#snippet icon()}
					<Cog />
				{/snippet}
			</SidebarItem>
		</SidebarGroup>
	</Sidebar>
	<div class="h-96 overflow-auto px-4 md:ml-64">
		<div class="rounded-lg border-2 border-dashed border-gray-200 p-4 dark:border-gray-700">
			{@render children()}
		</div>
	</div>
</div>
