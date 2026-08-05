<script>
	import { enhance } from '$app/forms';
	import favicon from '$lib/assets/favicon.svg';
	import { Moon, Sun } from '@lucide/svelte';
	import {
		A,
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
	const name = __APP_NAME__;
</script>

<Navbar>
	<NavBrand href="/">
		<img src={favicon} class="me-3 h-6 sm:h-9" alt="Logo" />
		<span class="self-center text-xl font-semibold whitespace-nowrap dark:text-white">{name}</span>
	</NavBrand>
	{#if data?.user}
		<div class="flex items-center md:order-2">
			<DarkMode class="text-lg">
				{#snippet lightIcon()}
					<Sun />
				{/snippet}
				{#snippet darkIcon()}
					<Moon />
				{/snippet}
			</DarkMode>
			<Avatar id="avatar-menu" src="https://avatars.githubusercontent.com/u/84850215?v=4&size=64" />
		</div>
		<Dropdown placement="bottom" triggeredBy="#avatar-menu">
			<DropdownHeader>
				<span class="block text-sm">{data.user.name}</span>
				<span class="block truncate text-sm font-medium">{data.user.email}</span>
			</DropdownHeader>
			<DropdownGroup>
				<DropdownItem>
					<A href="/dash">面板</A>
				</DropdownItem>
				<DropdownItem>
					<A href="/">设置</A>
				</DropdownItem>
			</DropdownGroup>
			<DropdownHeader>
				<form method="post" action="/logout" use:enhance>
					<button class="rounded-md bg-blue-600 px-4 py-2 text-white transition hover:bg-blue-700">
						退出登录
					</button>
				</form>
			</DropdownHeader>
		</Dropdown>
	{:else}
		<div class="flex items-center md:order-2">
			<DarkMode class="text-lg">
				{#snippet lightIcon()}
					<Sun />
				{/snippet}
				{#snippet darkIcon()}
					<Moon />
				{/snippet}
			</DarkMode>
			<Button href="/login">登录</Button>
		</div>
	{/if}
</Navbar>
