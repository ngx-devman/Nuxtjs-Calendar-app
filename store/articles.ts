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

export type ArticlesState = {
	items: any[]
}

export const getters: GetterTree<ArticlesState, RootState> = {
	items(state) {
		return state.items
	}
}

export const mutations: MutationTree<ArticlesState> = {
	add(state, articles: any | any[]) {
		const items = state.items

		const addItems = (e: any[]) =>
			e.forEach(e => {
				if (!e.id) return
				const existing = items.findIndex(i => i.id === e.id)

				if (existing > -1) {
					items[existing] = Object.assign(items[existing], e)
				} else items.push(e)
			})

		if (Array.isArray(articles)) {
			addItems(articles)
		} else if (typeof articles === 'object') {
			addItems([articles])
		}

		state.items = _.uniqBy(items, 'id')
	}
}

export type ArticlesFetchAction = (fetchOptions?: any) => Promise<any>
export type ArticlesFetchSingleAction = (articleId: number) => Promise<any>

export const actions: ActionTree<ArticlesState, RootState> = {
	fetch(ctx, filters: any = {}) {
		const params: any = {}
		Object.assign(params, filters)

		let key: keyof any
		for (key in params) {
			if (!params[key]) delete params[key]
		}

		if (params.start_date) {
			params.start_post_date = this.$moment(params.start_date).format(
				'YYYY-MM-DD'
			)
			delete params.start_date
		}

		params.ordering = '-post_date'
		return this.$api.get('articles/', { params }).then(res => {
			const data = res.data
			if (data.results) ctx.commit('add', data.results)
			else if (data.data) ctx.commit('add', data.data)
			return data
		})
	},
	fetch_single(ctx, articleId: number) {
		const existing = ctx.state.items[articleId]
		return new Promise((resolve, reject) => {
			if (existing) resolve(ctx.state.items[articleId])

			this.$api
				.$get(`articles/${articleId}/`)
				.then(data => {
					ctx.commit('add', data)
					resolve(data)
				})
				.catch(reject)
		})
	}
}
