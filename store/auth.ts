import { RootState } from '@store'
import _ from 'lodash'
import { GetterTree, ActionTree, MutationTree } from 'vuex'

export const state = () => ({
	user: false,
	token: false
})

export type AuthState = {
	user: any
	token: any
}

export const getters: GetterTree<AuthState, RootState> = {
	user(state) {
		return state.user
	},
	name(state) {
		return `${state.user.first_name} ${state.user.last_name}`
	},
	token(state) {
		return state.token
	},
	app_data(state) {
		const app_data = state.user.app_data
		if (!app_data) return {}
		return state.user.app_data
	},
	filters(state) {
		const app_data = state.user.app_data
		if (!app_data) return []
		if (!app_data.filters) return []
		return state.user.app_data.filters
	},
	/**
	 * Gets the current user's favorite events as a id array
	 * @param state AuthState
	 * @returns EventID[]
	 * @deprecated v0.7.0
	 */
	favorite_events(state) {
		const app_data = state.user.app_data
		if (!app_data) return []
		if (!app_data.favorite_events) return []
		return state.user.app_data.favorite_events
	},
	/**
	 * Gets the current user's favorite events as a id array
	 * @param state AuthState
	 * @returns EventID[]
	 */
	favorite_event(state) {
		const app_data = state.user.app_data
		if (!app_data) return []
		if (!app_data.favorite_events) return []
		return state.user.app_data.favorite_events
	}
}

export const mutations: MutationTree<AuthState> = {
	set(state, user: any) {
		if (user.app_data && typeof user.app_data === 'string') {
			user.app_data = JSON.parse(user.app_data)
		}

		state.user = user
	},
	token(state, token: any) {
		state.token = token

		if (window && window.localStorage) {
			localStorage.setItem('access', token.access)
			localStorage.setItem('refresh', token.refresh)
		}
	},
	filters(state, filters: any[]) {
		let app_data = state.user.app_data
		if (!app_data) app_data = {}
		if (!app_data.filters) app_data.filters = []

		app_data.filters = filters
		state.user.app_data = app_data
	},
	favorite_event(state, events: number[] | number) {
		let app_data = state.user.app_data
		if (!app_data) app_data = {}
		if (!app_data.favorite_events) app_data.favorite_events = []

		if (Array.isArray(events)) {
			events = [...app_data.favorite_events, ...events]
		} else if (app_data.favorite_events.includes(events)) {
			events = app_data.favorite_events.filter((e: number) => e !== events)
		} else {
			events = [...app_data.favorite_events, events]
		}

		events = _.uniq(events as number[])
		app_data.favorite_events = events
		state.user.app_data = app_data
	}
}

export const actions: ActionTree<AuthState, RootState> = {
	fetch({ commit, getters }, token?: any) {
		if (token) {
			this.$api.defaults.headers.Authorization = `Bearer ${token}`
		}

		return this.$api.$get('/members/me/').then(user => {
			commit('set', user)
			commit('token', user.token)

			if (this.$logrocket) {
				console.log('LogRocket: setting user')
				this.$logrocket.identify(user.id, {
					name: getters.name,
					email: user.email
				})
			}

			return getters.user
		})
	},
	refresh({ commit, dispatch }, refresh: any) {
		return this.$api.$post('/refresh/', { refresh }).then(token => {
			commit('token', token)
			return dispatch('fetch', token.access)
		})
	},
	save_app_data({ commit, getters }, app_data?: any) {
		if (!app_data) app_data = getters.app_data
		return this.$api.$patch('/members/me/', { app_data }).then(data => {
			commit('set', data)
			return getters.user
		})
	},
	save_filters({ commit, dispatch }, filters: any[]) {
		let filter: any
		for (filter of filters) {
			let option: any
			for (option in filter) {
				if (!filter[option]) delete filter[option]
			}
		}
		filters = filters.filter(f => Object.values(f).length > 0)

		commit('filters', filters)
		return dispatch('save_app_data')
	},
	favorite_event({ commit, getters, dispatch }, eventIDs: number[] | number) {
		commit('favorite_event', eventIDs)
		return dispatch('save_app_data').then(() => getters.favorite_events)
	}
}
