<script>
	import { enhance } from '$app/forms';
	import { CloudSync, HardDrive, SquarePen, Trash2 } from '@lucide/svelte';
	import { Badge, Button, ButtonGroup, Card } from 'flowbite-svelte';

	let { data } = $props();

	/** @type {Record<string, typeof HardDrive>} */
	const driverIcons = {
		local: HardDrive,
		s3: CloudSync,
		webdav: CloudSync,
		onedrive: CloudSync,
		gdrive: CloudSync
	};

	/** @param {string} type */
	function getDriverIcon(type) {
		return driverIcons[type] || HardDrive;
	}

	/** @param {string} key */
	function getConfigLabel(key) {
		/** @type {Record<string, string>} */
		const labels = {
			accessKeyId: 'Access Key ID',
			secretAccessKey: 'Secret Access Key',
			bucket: 'Bucket',
			region: 'Region',
			endpoint: 'Endpoint',
			path: 'Path',
			username: 'Username',
			password: 'Password',
			url: 'URL'
		};
		return labels[key] || key;
	}
</script>

<div class="space-y-4">
	{#if data.storages.length === 0}
		<Card>
			<p class="text-center text-gray-500">暂无存储配置</p>
		</Card>
	{:else}
		{#each data.storages as storage (storage.id)}
			<Card>
				<div class="flex items-center justify-between">
					<div class="flex items-center gap-2">
						{@const Icon = getDriverIcon(storage.driverType)}
						<Icon class="h-5 w-5" />
						<h3 class="text-lg font-semibold">{storage.mountPath}</h3>
						<Badge color={storage.isActive ? 'green' : 'red'}>
							{storage.isActive ? '启用' : '禁用'}
						</Badge>
					</div>
					<ButtonGroup class="*:ring-primary-700!">
						<Button>
							<CloudSync class="h-4 w-4" />
							测试连接
						</Button>
						<Button>
							<SquarePen class="h-4 w-4" />
							修改
						</Button>
						<form method="post" action="?/delete" use:enhance>
							<input type="hidden" name="id" value={storage.id} />
							<Button type="submit">
								<Trash2 class="h-4 w-4" />
								删除
							</Button>
						</form>
					</ButtonGroup>
				</div>
				<div class="mt-3 grid grid-cols-2 gap-2 text-sm">
					<div>
						<span class="text-gray-500">驱动类型：</span>
						<span class="font-mono">{storage.driverType}</span>
					</div>
					{#each Object.entries(storage.driverConfig) as [key, value] (key)}
						<div>
							<span class="text-gray-500">{getConfigLabel(key)}：</span>
							<span class="font-mono">{value}</span>
						</div>
					{/each}
				</div>
			</Card>
		{/each}
	{/if}
</div>
