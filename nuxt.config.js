import alias from './config/alias'
import pkg from './package.json'

process.env.production = process.env.NODE_ENV
process.env.dirname = __dirname

const appMeta = {
	title: 'CliffsLiving',
	description: ''
}

let fontawesomeURL = '/assets/fontawesome/css/all.min.css'
if (process.env.production) {
	fontawesomeURL = 'https://pro.fontawesome.com/releases/v5.15.3/css/all.css'
}

export default {
	ssr: false,
	target: 'static',
	// server: {
	// 	host: '192.168.1.26',
	// },
	alias,
	publicRuntimeConfig: {
		version: pkg.version
	},
	// Global page headers: https://go.nuxtjs.dev/config-head
	head: {
		title: 'Home',
		titleTemplate: '%s - ' + appMeta.title,
		meta: [
			{ charset: 'utf-8' },
			{
				name: 'viewport',
				content:
					'width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no'
			},
			{ hid: 'description', name: 'description', content: appMeta.description }
		],
		link: [
			{ rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
			{
				rel: 'stylesheet',
				href: fontawesomeURL,
				integrity:
					'sha384-iKbFRxucmOHIcpWdX9NTZ5WETOPm0Goy0WmfyNcl52qSYtc2Buk0NCe6jU1sWWNB',
				crossorigin: 'anonymous'
			}
		],
		script: [
			{
				src: 'https://addevent.com/libs/atc/1.6.1/atc.min.js'
			}
		]
	},

	render: {
		// Setting up cache for 'static' directory - a year in milliseconds
		// https://web.dev/uses-long-cache-ttl
		static: {
			maxAge: 60 * 60 * 24 * 365 * 1000
		}
	},

	// Global CSS: https://go.nuxtjs.dev/config-css
	css: ['@assets/styles/app.scss'],
	layoutTransition: 'layout',
	pageTransition: 'page',

	// Plugins to run before rendering page: https://go.nuxtjs.dev/config-plugins
	plugins: [
		'@plugins/common',
		'@plugins/moment',
		'@plugins/api',
		'@plugins/modals',
		'@plugins/notify',
		'@plugins/logrocket.client'
	],
	components: true,

	// Modules for dev and build (recommended): https://go.nuxtjs.dev/config-modules
	buildModules: [
		// https://go.nuxtjs.dev/typescript
		'@nuxt/typescript-build'
	],

	// Modules: https://go.nuxtjs.dev/config-modules
	modules: [
		// https://go.nuxtjs.dev/axios
		'@nuxtjs/axios',
		// https://go.nuxtjs.dev/pwa
		'@nuxtjs/pwa'
	],

	compressor: {
		threshold: 9
	},

	// Axios module configuration: https://go.nuxtjs.dev/config-axios
	axios: {},

	// PWA module configuration: https://go.nuxtjs.dev/pwa
	pwa: {
		meta: {
			name: appMeta.title,
			description: appMeta.description,
			theme_color: '#ffffff',
			nativeUI: true,
			mobileAppIOS: true
		},
		manifest: {
			name: appMeta.title,
			short_name: appMeta.title,
			description: appMeta.description,
			lang: 'en',
			display: 'fullscreen',
			version: pkg.version
		},
		workbox: {
			// enabled: true,
			cacheOptions: {
				cacheId: pkg.name,
				revision: pkg.version
			}
		}
	},

	// Build Configuration: https://go.nuxtjs.dev/config-build
	build: {
		extend(config, ctx) {
			if (ctx.isDev) {
				config.devtool = ctx.isClient ? 'source-map' : 'inline-source-map'
			}
		}
	}
}
