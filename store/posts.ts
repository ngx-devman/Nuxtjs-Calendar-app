import _ from 'lodash'
import { GetterTree, ActionTree, MutationTree } from 'vuex'
import { RootState } from './index'

export interface PostData {
	id: number
	title: string
	post_date: string
	snippet: string
	media: {
		id: string
		name: string
		url: string
		ext: string
	}
	button_text: string | null
	event: any
	article: any
}

export interface APIListResult {
	count: number
	next: string
	previous: string
	data: PostData[]
	results?: any[]
}

export const state = () => ({
	items: []
})

export type PostsState = {
	items: PostData[]
}

export const getters: GetterTree<PostsState, RootState> = {
	items(state) {
		return state.items
	}
}

export const mutations: MutationTree<PostsState> = {
	add(state, posts: any | any[]) {
		const items = state.items

		const addItems = (e: any[]) =>
			e.forEach(e => {
				if (!e.id) return
				const existing = items.findIndex(i => i.id === e.id)

				if (existing > -1) {
					items[existing] = Object.assign(items[existing], e)
				} else items.push(e)
			})

		if (Array.isArray(posts)) {
			addItems(posts)
		} else if (typeof posts === 'object') {
			addItems([posts])
		}

		state.items = _.uniqBy(items, 'id')
	}
}

export type PostsFetchAction = (fetchOptions?: any) => Promise<APIListResult>
export type PostsFetchSingleAction = (postId: number) => Promise<PostData>

export const actions: ActionTree<PostsState, RootState> = {
	fetch(ctx, filters: any = {}) {
		const params: any = {}
		Object.assign(params, filters)

		let key: keyof any
		for (key in params) {
			if (!params[key]) delete params[key]
		}

		if (params.start_date) {
			params.start_date = this.$moment(params.start_date).format('YYYY-MM-DD')
		}

		params.ordering = '-post_date'
		return this.$api.get('posts/', { params }).then(res => {
			const data = res.data
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
				.$get(`posts/${postId}/`)
				.then(data => {
					ctx.commit('add', data)
					resolve(data)

					if (data.location) {
						ctx.commit('locations/add', data.location, { root: true })
					}
				})
				.catch(reject)
		})
	}
}
