module.exports = {
	root: true,
	env: {
		browser: true,
		node: true
	},
	extends: [
		'@nuxtjs/eslint-config-typescript',
		'prettier',
		'prettier/vue',
		'plugin:prettier/recommended',
		'plugin:nuxt/recommended'
	],
	plugins: ['prettier'],
	// add your custom rules here
	rules: {
		'no-unused-vars': 'off',
		'@typescript-eslint/no-unused-vars': 'off',
		'no-console': 'off',
		camelcase: 'off',
		'vue/no-v-html': 'off',
		'no-case-declarations': 'off'
	},
	ignorePatterns: ['static/assets/fontawesome/*']
}
