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

export type CategoriesState = {
	items: any[]
}

export const getters: GetterTree<CategoriesState, RootState> = {
	items(state) {
		return state.items
	},
	event_types(state) {
		return state.items.filter(i => i.category_type === 'event')
	},
	spaces(state) {
		return state.items.filter(i => i.category_type === 'space')
	}
}

export const mutations: MutationTree<CategoriesState> = {
	add(state, categories: any | any[]) {
		const items = state.items

		const addItems = (e: any[]) =>
			e.forEach(e => {
				if (!e.id) return
				const existing = items.findIndex(i => i.id === e.id)

				if (existing > -1) {
					items[existing] = Object.assign(items[existing], e)
				} else items.push(e)
			})

		if (Array.isArray(categories)) {
			addItems(categories)
		} else if (typeof categories === 'object') {
			addItems([categories])
		}

		state.items = _.uniqBy(items, 'id')
	}
}

export type CategoriesFetchAction = (fetchOptions?: any) => Promise<any>
export type CategoriesFetchSingleAction = (categoryId: number) => any

export const actions: ActionTree<CategoriesState, RootState> = {
	fetch(ctx, filters: any = {}) {
		const params: any = Object.assign({}, filters)
		return this.$api.get('categories/', { params }).then(res => {
			const data = res.data
			if (data.results) ctx.commit('add', data.results)
			else if (data.data) ctx.commit('add', data.data)
			return data
		})
	},
	fetch_single(ctx, categoryId: number) {
		const existing = ctx.state.items[categoryId]
		if (existing) return ctx.state.items[categoryId]
		return false

		// return new Promise((resolve, reject) => {
		// 	if (existing) resolve(ctx.state.items[categoryId])
		// 	return reject(new Error('not found'))
		// 	return this.$api
		// 		.$get(`categories/${categoryId}/`)
		// 		.then((data) => {
		// 			ctx.commit('add', data)
		// 			resolve(data)
		// 		})
		// 		.catch(reject)
		// })
	}
}
