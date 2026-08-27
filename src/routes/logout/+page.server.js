import { redirect } from '@sveltejs/kit';

/** @param {import('@sveltejs/kit').RequestEvent} event */
async function signOut(event) {
	if (!event.locals.user) return redirect(302, '/');
	await event.locals.auth.api.signOut({ headers: event.request.headers });
	return redirect(302, '/');
}

export const load = signOut;
export const actions = { default: signOut };
