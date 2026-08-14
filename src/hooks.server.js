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
	if (!d1) throw new Error('D1 binding "DB" not found - are you running with wrangler?');
	event.locals.db = getDb(d1);
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

let isInitialized = false;
/** @type {import('@sveltejs/kit').Handle} */
const handleInit = async ({ event, resolve }) => {
	const acceptsHtml = event.request.headers.get('accept')?.includes('text/html');
	if (!acceptsHtml) {
		return resolve(event);
	}
	if (event.url.pathname === '/init') {
		const { db } = event.locals;
		const isUser = await db.select({ id: user.id }).from(user).limit(1);
		if (isUser.length > 0) {
			isInitialized = true;
			throw redirect(307, '/');
		}
	}
	if (!isInitialized) {
		if (event.url.pathname !== '/init') {
			throw redirect(307, '/init');
		}
	}
	return resolve(event);
};
/** @type {import('@sveltejs/kit').Handle} */
export const handle = sequence(handleDb, handleBetterAuth, handleInit);
