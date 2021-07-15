import { Plugin } from '@nuxt/types'
import { NuxtAxiosInstance } from '@nuxtjs/axios'
import { AxiosError } from 'axios'

declare module 'vue/types/vue' {
	interface Vue {
		$api: NuxtAxiosInstance
	}
}

declare module '@nuxt/types' {
	interface NuxtAppOptions {
		$api: NuxtAxiosInstance
	}

	interface Context {
		$api: NuxtAxiosInstance
	}
}

declare module 'vuex/types/index' {
	interface Store<S> {
		$api: NuxtAxiosInstance
	}
}

const API: Plugin = (context, inject) => {
	const api = context.$axios.create({
		baseURL: 'https://clublisi-stg.herokuapp.com/api/v1'
	})

	api.interceptors.response.use(undefined, async (err: AxiosError) => {
		const res = err.response

		// it is a unauth error
		if (!res || res.status !== 401) throw err

		try {
			await context.store.dispatch(
				'auth/refresh',
				context.store.getters['auth/token'].refresh
			)
		} catch {
			console.error('failed reauthing')
			throw err
		}

		console.log('token refreshed')
		err.config.headers.Authorization = api.defaults.headers.Authorization

		return api.request(err.config)
	})

	inject('api', api)
}

export default API
