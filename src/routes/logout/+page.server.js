import { redirect } from '@sveltejs/kit';

export const load = async (event) => {
	if (event.locals.user) {
		const { auth } = event.locals;

		await auth.api.signOut({
			headers: event.request.headers
		});
	}
	return redirect(302, '/');
};

export const actions = {
	default: async (event) => {
		const { auth } = event.locals;

		await auth.api.signOut({
			headers: event.request.headers
		});
		return redirect(302, '/');
	}
};
