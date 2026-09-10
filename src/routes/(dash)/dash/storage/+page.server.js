import { fail } from '@sveltejs/kit';
import { storageConfigs } from '$lib/server/db/schema';
import { eq } from 'drizzle-orm';

/** @type {string[]} */
const ALLOWED_DRIVERS = ['s3', 'webdav'];

/** @type {Record<string, string[]>} */
const driverRequiredFields = {
	s3: ['endpoint', 'region', 'accessKeyId', 'secretAccessKey', 'bucket'],
	webdav: ['url', 'username', 'password']
};

/**
 * @param {FormData} formData
 * @returns {{ mountPath: string; driverType: string; isActive: boolean; driverConfig: Record<string, string>; id?: string }}
 */
function parseFormData(formData) {
	/** @type {Record<string, string>} */
	const driverConfig = {};
	for (const key of formData.keys()) {
		if (key.startsWith('config.')) {
			driverConfig[key.replace('config.', '')] = formData.get(key)?.toString() ?? '';
		}
	}
	return {
		id: formData.get('id')?.toString() ?? '',
		mountPath: formData.get('mountPath')?.toString().trim() ?? '',
		driverType: formData.get('driverType')?.toString() ?? '',
		isActive: formData.get('isActive') === 'on',
		driverConfig
	};
}

/**
 * @param {{ mountPath: string; driverType: string; driverConfig: Record<string, string> }} data
 * @returns {string | null}
 */
function validateStorage(data) {
	if (!data.mountPath) return '挂载路径不能为空';
	if (!ALLOWED_DRIVERS.includes(data.driverType)) return '不支持的驱动类型';

	/** @type {string[]} */
	const required = driverRequiredFields[data.driverType] || [];
	for (const field of required) {
		if (!data.driverConfig[field]?.toString().trim()) {
			return `缺少必填字段: ${field}`;
		}
	}
	return null;
}

/**
 * @param {import('drizzle-orm').SQLiteDatabase} db
 * @param {string} mountPath
 * @param {string} [excludeId]
 * @returns {Promise<boolean>}
 */
async function checkMountPathUnique(db, mountPath, excludeId) {
	const existing = await db
		.select({ id: storageConfigs.id })
		.from(storageConfigs)
		.where(eq(storageConfigs.mountPath, mountPath))
		.limit(1);
	return existing.length > 0 && existing[0].id !== excludeId;
}

export const load = async (event) => {
	const storages = await event.locals.db.select().from(storageConfigs);
	return { storages };
};

export const actions = {
	/**
	 * @param {import('@sveltejs/kit').RequestEvent} event
	 */
	create: async (event) => {
		const data = parseFormData(await event.request.formData());
		const err = validateStorage(data);
		if (err) return fail(400, { error: err });
		if (await checkMountPathUnique(event.locals.db, data.mountPath))
			return fail(400, { error: '挂载路径已存在' });

		await event.locals.db.insert(storageConfigs).values({
			mountPath: data.mountPath,
			driverType: data.driverType,
			driverConfig: data.driverConfig,
			isActive: data.isActive
		});
		return { success: true };
	},

	/**
	 * @param {import('@sveltejs/kit').RequestEvent} event
	 */
	update: async (event) => {
		const data = parseFormData(await event.request.formData());
		if (!data.id) return fail(400, { error: '缺少 ID' });
		const err = validateStorage(data);
		if (err) return fail(400, { error: err });
		if (await checkMountPathUnique(event.locals.db, data.mountPath, data.id))
			return fail(400, { error: '挂载路径已存在' });

		await event.locals.db
			.update(storageConfigs)
			.set({
				mountPath: data.mountPath,
				driverType: data.driverType,
				driverConfig: data.driverConfig,
				isActive: data.isActive
			})
			.where(eq(storageConfigs.id, data.id));
		return { success: true };
	},

	/**
	 * @param {import('@sveltejs/kit').RequestEvent} event
	 */
	delete: async (event) => {
		const formData = await event.request.formData();
		/** @type {string} */
		const id = formData.get('id')?.toString() ?? '';
		if (!id) return fail(400, { error: '缺少 ID' });

		await event.locals.db.delete(storageConfigs).where(eq(storageConfigs.id, id));
		return { success: true };
	}
};
