import { Plugin } from '@nuxt/types'
import LogRocket from 'logrocket'

declare module 'vue/types/vue' {
	interface Vue {
		$logrocket: typeof LogRocket
	}
}

declare module 'vuex/types/index' {
	interface Store<S> {
		$logrocket: typeof LogRocket
	}
}

const LogRocketPlugin: Plugin = ({ store, isDev }, inject) => {
	if (!isDev) {
		LogRocket.init('tm9zx6/development-9becz')
	}

	const user = store.getters['auth/user']

	if (user) {
		console.log('LogRocket: setting user')
		LogRocket.identify(user.id, user)
	}

	inject('logrocket', LogRocket)
}

export default LogRocketPlugin
