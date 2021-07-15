import { Plugin } from '@nuxt/types'

declare module '@nuxt/types/app' {
	interface NuxtError {
		title?: string
	}
}

const CommonPlugin: Plugin = ctx => {
	console.log('ClubLisi v' + ctx.$config.version)
	ctx.$axios.defaults.baseURL = window.location.origin
}

export default CommonPlugin
