import { Middleware } from '@nuxt/types'

const AuthMiddleware: Middleware = ({ store, error }) => {
	if (store.getters['auth/user']) return
	const access_token = localStorage.getItem('access')
	const refresh_token = localStorage.getItem('refresh')
	let action: Promise<any>

	if (!access_token && refresh_token) {
		action = store.dispatch('auth/refresh', refresh_token)
	} else if (access_token) {
		action = store.dispatch('auth/fetch', access_token)
	} else {
		action = Promise.reject(new Error('Unauthorized'))
	}

	return action
		.catch(err => {
			console.error(err)
			if (refresh_token) {
				console.log('failed auth but has refresh token, checking...')
				return store.dispatch('auth/refresh', refresh_token)
			} else {
				console.log('no refresh token, rejecting')
				return Promise.reject(new Error())
			}
		})
		.catch(() => {
			if (window && window.localStorage) {
				localStorage.removeItem('access')
				localStorage.removeItem('refresh')
			}

			error({
				message: 'You are not authorized to view this page',
				statusCode: 401
			})
		})
}

export default AuthMiddleware
