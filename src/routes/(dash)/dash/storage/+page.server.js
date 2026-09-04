import { storageConfigs } from '$lib/server/db/schema';

export const load = async (event) => {
	const storages = await event.locals.db.select().from(storageConfigs);
	return { storages };
};
