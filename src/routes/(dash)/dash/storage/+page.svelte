<script>
	import { enhance } from '$app/forms';
	import { CloudSync, HardDrive, SquarePen, Trash2 } from '@lucide/svelte';
	import { Badge, Button, ButtonGroup, Card } from 'flowbite-svelte';

	let { data } = $props();
</script>

<div>
	<div>添加配置</div>
	{#if data.storages.length === 0}
		<Card>
			<p>暂无存储配置</p>
		</Card>
	{:else}
		{#each data.storages as storage (storage.id)}
			<Card>
				<div>
					<h3>{storage.mountPath}</h3>
					<Badge color={storage.isActive ? 'green' : 'red'}>
						{storage.isActive ? '启用' : '禁用'}
					</Badge>
				</div>
				<div>// 遍历驱动专属配置</div>
				<div>
					<ButtonGroup>
						<Button>
							<SquarePen />
							修改
						</Button>
						<form method="post" action="?/delete" use:enhance>
							<input type="hidden" name="id" value={storage.id} />
							<Button type="submit">
								<Trash2 />
								删除
							</Button>
						</form>
					</ButtonGroup>
				</div>
			</Card>
		{/each}
	{/if}
</div>
