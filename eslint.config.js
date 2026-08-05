import js from '@eslint/js';
import prettier from 'eslint-config-prettier';
import svelte from 'eslint-plugin-svelte';
import { defineConfig, includeIgnoreFile } from 'eslint/config';
import globals from 'globals';
import path from 'node:path';

const gitignorePath = path.resolve(import.meta.dirname, '.gitignore');

export default defineConfig([
	includeIgnoreFile(gitignorePath),
	js.configs.recommended,
	svelte.configs.recommended,
	prettier,
	svelte.configs.prettier,
	{
		languageOptions: {
			globals: {
				...globals.browser,
				...globals.node,
				__APP_NAME__: 'readonly',
				__APP_VERSION__: 'readonly'
			}
		}
	},

	{
		files: ['**/*.svelte', '**/*.svelte.js'],
		languageOptions: { parserOptions: {} }
	},

	{
		// Override or add rule settings here, such as:
		// 'svelte/button-has-type': 'error'
		rules: {}
	}
]);
