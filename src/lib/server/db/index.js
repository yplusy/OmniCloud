import { drizzle } from 'drizzle-orm/d1';
import * as schema from './schema';

/** @param {D1Database} d1 */
export const getDb = (d1) => drizzle(d1, { schema });
