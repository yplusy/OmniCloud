<script>
	import { enhance } from '$app/forms';
	import { Button, Card, Input, Label } from 'flowbite-svelte';

	let { form } = $props();
</script>

<Card class="mx-auto p-4 sm:p-6 md:p-8">
	<form class="flex flex-col space-y-6" method="post" action="?/signUpEmail" use:enhance>
		<h3 class="text-xl font-medium text-gray-900 dark:text-white">注册</h3>
		<Label class="space-y-2">
			<span>电子邮箱</span>
			<Input type="email" name="email" placeholder="admin@ex.com" required />
		</Label>
		<Label class="space-y-2">
			<span>密码</span>
			<Input type="password" name="password" placeholder="******" required />
		</Label>
		<Button type="submit" class="w-full">注册</Button>
	</form>
	<p class="text-red-500">{form?.message ?? ''}</p>
</Card>
