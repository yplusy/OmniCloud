import { fail } from '@sveltejs/kit';
import { eq } from 'drizzle-orm';
import { storageConfigs } from '$lib/server/db/schema';

export const load = async (event) => {
	const storages = await event.locals.db.select().from(storageConfigs);
	return { storages };
};

export const actions = {
	delete: async (event) => {
		const formData = await event.request.formData();
		const id = formData.get('id')?.toString();
		if (!id) return fail(400, { message: '缺少配置 ID' });
		await event.locals.db.delete(storageConfigs).where(eq(storageConfigs.id, id));
		return {};
	}
};
