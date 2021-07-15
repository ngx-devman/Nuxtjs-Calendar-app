import { Plugin } from '@nuxt/types'
import moment from 'moment-timezone'

declare module 'vue/types/vue' {
	interface Vue {
		$moment: typeof moment
	}
}

declare module '@nuxt/types' {
	interface NuxtAppOptions {
		$moment: typeof moment
	}

	interface Context {
		$moment: typeof moment
	}
}

declare module 'vuex/types/index' {
	interface Store<S> {
		$moment: typeof moment
	}
}

const Moment: Plugin = (context, inject) => {
	moment.tz.setDefault(moment.tz.guess())
	inject('moment', moment)
}

export default Moment
