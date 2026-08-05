import { index, integer, sqliteTable, text } from 'drizzle-orm/sqlite-core';

export const storageConfigs = sqliteTable(
	'storage_configs',
	{
		id: text('id')
			.primaryKey()
			.$defaultFn(() => crypto.randomUUID()),
		mountPath: text('mount_path').notNull().unique(), // 挂载路径
		driverType: text('driver_type').notNull(), // 驱动类型
		configJson: text('config_json').notNull(), // 驱动专属配置
		isActive: integer('is_active', { mode: 'boolean' }).notNull().default(true), // 状态控制
		createdAt: text('created_at').$defaultFn(() => new Date().toISOString()),
		updatedAt: text('updated_at').$onUpdateFn(() => new Date().toISOString())
	},
	(table) => [index('idx_mount_path').on(table.mountPath)]
);

export * from './auth.schema';
