<script>
	import { enhance } from '$app/forms';
	import favicon from '$lib/assets/favicon.svg';
	import { Moon, Sun } from '@lucide/svelte';
	import {
		Avatar,
		Button,
		DarkMode,
		Dropdown,
		DropdownGroup,
		DropdownHeader,
		DropdownItem,
		Navbar,
		NavBrand
	} from 'flowbite-svelte';

	let { data } = $props();
</script>

<Navbar fluid>
	<NavBrand href="/">
		<img src={favicon} class="me-3 h-6 sm:h-9" alt="Logo" />
		<span class="self-center text-xl font-semibold whitespace-nowrap dark:text-white">
			{__APP_NAME__}
		</span>
	</NavBrand>
	<div class="flex items-center gap-3 md:order-2">
		<DarkMode class="text-lg" aria-label="切换主题">
			{#snippet lightIcon()}
				<Sun />
			{/snippet}
			{#snippet darkIcon()}
				<Moon />
			{/snippet}
		</DarkMode>
		{#if data?.user}
			<div id="avatar-menu">
				<Avatar src="" alt={data.user.name} />
			</div>
			<Dropdown placement="bottom" triggeredBy="#avatar-menu">
				<DropdownHeader>
					<span class="block text-sm">{data.user.name}</span>
					<span class="block truncate text-sm font-medium">{data.user.email}</span>
				</DropdownHeader>
				<DropdownGroup>
					<DropdownItem href="/dash">面板</DropdownItem>
					<DropdownItem href="/settings">设置</DropdownItem>
				</DropdownGroup>
				<DropdownGroup>
					<form method="post" action="/logout" use:enhance>
						<Button>退出登录</Button>
					</form>
				</DropdownGroup>
			</Dropdown>
		{:else}
			<Button href="/login">登录</Button>
		{/if}
	</div>
</Navbar>
