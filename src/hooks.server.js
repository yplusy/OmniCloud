import { building } from '$app/environment';
import { createAuth } from '$lib/server/auth';
import { getDb } from '$lib/server/db';
import { user } from '$lib/server/db/schema';
import { redirect } from '@sveltejs/kit';
import { sequence } from '@sveltejs/kit/hooks';
import { svelteKitHandler } from 'better-auth/svelte-kit';

/** @type {import('@sveltejs/kit').Handle} */
const handleDb = async ({ event, resolve }) => {
	const d1 = event.platform?.env?.DB;
	if (d1) event.locals.db = getDb(d1);
	return resolve(event);
};

/** @type {import('@sveltejs/kit').Handle} */
const handleBetterAuth = async ({ event, resolve }) => {
	if (!event.platform?.env?.DB)
		throw new Error('D1 binding "DB" not found - are you running with wrangler?');

	event.locals.auth = createAuth(event.platform.env.DB);

	const { auth } = event.locals;
	const session = await auth.api.getSession({ headers: event.request.headers });

	if (session) {
		event.locals.session = session.session;
		event.locals.user = session.user;
	}

	return svelteKitHandler({ event, resolve, auth, building });
};

/** @type {boolean} */
let initialized = false;

/** @type {import('@sveltejs/kit').Handle} */
const handleInit = async ({ event, resolve }) => {
	const { db } = event.locals;
	if (!db) return resolve(event);

	const isInitRoute = event.url.pathname === '/init';
	const isDocumentRequest =
		event.request.method === 'GET' &&
		(event.request.headers.get('accept') ?? '').includes('text/html');

	if (!isDocumentRequest && !isInitRoute) return resolve(event);

	if (isInitRoute || !initialized) {
		try {
			const rows = await db.select({ id: user.id }).from(user).limit(1);
			initialized = rows.length > 0;
		} catch {
			initialized = false;
		}
	}
	event.locals.initialized = initialized;

	if (!isDocumentRequest) return resolve(event);
	if (!initialized && !isInitRoute) redirect(303, '/init');
	if (initialized && isInitRoute) redirect(303, '/');
	return resolve(event);
};

/** @type {import('@sveltejs/kit').Handle} */
export const handle = sequence(handleDb, handleBetterAuth, handleInit);
