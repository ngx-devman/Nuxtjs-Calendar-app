import _ from 'lodash'
import { GetterTree, ActionTree, MutationTree } from 'vuex'
import { RootState } from './index'

export interface APIListResult {
	count: number
	next: string
	previous: string
	data?: any[]
	results?: any[]
}

export const state = () => ({
	items: []
})

export type LocationsState = {
	items: any[]
}

export const getters: GetterTree<LocationsState, RootState> = {
	items(state) {
		return state.items
	}
}

export const mutations: MutationTree<LocationsState> = {
	add(state, locations: any | any[]) {
		const items = state.items

		const addItems = (e: any[]) =>
			e.forEach(e => {
				if (!e.id) return
				const existing = items.findIndex(i => i.id === e.id)

				if (existing > -1) {
					items[existing] = Object.assign(items[existing], e)
				} else items.push(e)
			})

		if (Array.isArray(locations)) {
			addItems(locations)
		} else if (typeof locations === 'object') {
			addItems([locations])
		}

		state.items = _.uniqBy(items, 'id')
	}
}

export type LocationsFetchAction = (fetchOptions?: any) => Promise<any>
export type LocationsFetchSingleAction = (postId: number) => Promise<any>

export const actions: ActionTree<LocationsState, RootState> = {
	fetch(ctx, filters: any = {}) {
		const params: any = {}
		Object.assign(params, filters)
		let key: keyof any
		for (key in params) {
			if (!params[key]) delete params[key]
		}

		return this.$api.$get('locations/', { params }).then(data => {
			if (data.results) ctx.commit('add', data.results)
			else if (data.data) ctx.commit('add', data.data)
			return data
		})
	},
	fetch_single(ctx, postId: number) {
		const existing = ctx.state.items[postId]
		return new Promise((resolve, reject) => {
			if (existing) resolve(ctx.state.items[postId])
			this.$api
				.$get(`locations/${postId}`)
				.then(data => {
					ctx.commit('add', data)
					resolve(data)
				})
				.catch(reject)
		})
	}
}
