<script>
	import { enhance } from '$app/forms';
	import {
		Badge,
		Button,
		ButtonGroup,
		Card,
		Checkbox,
		Hr,
		Input,
		Label,
		Modal,
		Select
	} from 'flowbite-svelte';
	import { slide } from 'svelte/transition';
	let { data } = $props();
	let open = $state(false);
	let popupModal = $state(false);
	let editStorage = $state(null);
	let storageConfig = $state({
		mountPath: '',
		driverType: 's3',
		isActive: true,
		config: {}
	});
	const driverFields = {
		s3: [
			{
				name: 'endpoint',
				label: '端点 URL',
				type: 'text',
				placeholder: 'https://s3.amazonaws.com'
			},
			{ name: 'region', label: '区域', type: 'text', placeholder: 'us-east-1' },
			{ name: 'accessKeyId', label: '访问密钥 ID', type: 'text' },
			{ name: 'secretAccessKey', label: '访问密钥 Secret', type: 'password' },
			{ name: 'bucket', label: '存储桶名称', type: 'text' }
		],
		webdav: [
			{ name: 'url', label: '服务器地址', type: 'text', placeholder: 'https://webdav.example.com' },
			{ name: 'username', label: '用户名', type: 'text' },
			{ name: 'password', label: '密码', type: 'password' }
		]
	};
	function openEditModal(storage) {
		editStorage = storage;
		storageConfig = {
			mountPath: storage.mountPath,
			driverType: storage.driverType,
			isActive: storage.isActive,
			config: storage.driverConfig || {}
		};
		open = true;
	}
</script>

<div>
	<div class="flex">
		<Button onclick={() => (open = true)}>添加配置</Button>
		<Button color="alternative">刷新列表</Button>
	</div>

	{#if data.storages.length === 0}
		<Card>暂无存储配置，点击上方按钮添加</Card>
	{:else}
		{#each data.storages as storage (storage.id)}
			<Card>
				<div>
					<h3>{storage.mountPath}</h3>
					<div>
						<Badge color={storage.isActive ? 'green' : 'red'}>
							{storage.isActive ? '启用' : '禁用'}
						</Badge>
					</div>
					{#each driverFields[storage.driverType] || [] as field}
						{#if field.type != 'password'}
							<li>
								<strong>{field.label}:</strong>
								<span>{storage.driverConfig[field.name] || ''}</span>
							</li>
						{/if}
					{/each}
				</div>
				<div>
					<ButtonGroup class="*:ring-primary-700!">
						<Button onclick={() => openEditModal(storage)}>编辑</Button>
						<form method="post" action="?/delete" use:enhance>
							<input type="hidden" name="id" value={storage.id} />
							<Button onclick={() => (popupModal = true)}>删除</Button>
						</form>
					</ButtonGroup>
				</div>
			</Card>
		{/each}
	{/if}

	<Modal bind:open title={editStorage ? '编辑存储配置' : '添加存储配置'}>
		<form method="post" action={editStorage ? '?/update' : '?/create'} use:enhance>
			{#if editStorage}
				<input type="hidden" name="id" value={editStorage.id} />
			{/if}
			<div class="flex">
				<Label for="mountPath">
					挂载路径
					<Input type="text" id="mountPath" name="mountPath" bind:value={storageConfig.mountPath} />
				</Label>
				<Label for="driverType">
					存储类型
					<Select bind:value={storageConfig.driverType} id="driverType" name="driverType">
						<option value="s3">S3 兼容存储</option>
						<option value="webdav">WebDAV</option>
					</Select>
				</Label>
				<Label for="storageCapacityLimits">
					存储容量限制
					<Input type="number" id="storageCapacityLimits" name="storageCapacityLimits" />
				</Label>
			</div>
			<div>
				<Hr class="my-2">驱动配置</Hr>
				{#each driverFields[storageConfig.driverType] as field (field.name)}
					<Label for="config-{field.name}">
						{field.label}
						<Input
							id="config-{field.name}"
							name="config.{field.name}"
							type={field.type}
							bind:value={storageConfig.config[field.name]}
							placeholder={field.placeholder}
						/>
					</Label>
				{/each}
			</div>
			<Label for="isActive">
				<Checkbox id="isActive" bind:checked={storageConfig.isActive} />
				启用
			</Label>
			<Button type="submit" value="accept">{editStorage ? '更新' : '创建'}</Button>
			<Button onclick={() => (open = false)} color="alternative">取消</Button>
		</form>
	</Modal>

	<Modal form bind:open={popupModal} size="xs" transition={slide} permanent>
		<div class="text-center">
			<h3 class="mb-5 text-lg font-normal text-gray-500 dark:text-gray-400">
				您确定要删除此配置吗？
			</h3>
			<div class="space-x-2">
				<Button type="submit" value="yes" color="red">是的，我确定</Button>
				<Button type="submit" value="no" color="alternative">不，取消</Button>
			</div>
		</div>
	</Modal>
</div>
