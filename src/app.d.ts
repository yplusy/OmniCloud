import { createAuth } from '$lib/server/auth';
import type { Session, User } from 'better-auth';
import type { DrizzleD1Database } from 'drizzle-orm/d1';

// See https://svelte.dev/docs/kit/types#app.d.ts
// for information about these interfaces
declare global {
	const __APP_NAME__: string;
	const __APP_VERSION__: string;

	namespace App {
		interface Platform {
			env: Env;
			ctx: ExecutionContext;
			caches: CacheStorage;
			cf?: IncomingRequestCfProperties;
		}

		interface Locals {
			user?: User;
			session?: Session;
			auth: ReturnType<typeof createAuth>;
			db: DrizzleD1Database<typeof schema>;
		}

		// interface Error {}
		// interface PageData {}
		// interface PageState {}
	}
}

export {};
