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

export type MembersState = {
	items: any[]
}

// getter
export const getters: GetterTree<MembersState, RootState> = {
	items(state) {
		return state.items
	}
}

// mutation
export const mutations: MutationTree<MembersState> = {
	add(state, members: any | any[]) {
		const items = state.items

		const addItems = (e: any[]) =>
			e.forEach(e => {
				if (!e.id) return
				const existing = items.findIndex(i => i.id === e.id)

				if (existing > -1) {
					items[existing] = Object.assign(items[existing], e)
				} else items.push(e)
			})

		if (Array.isArray(members)) {
			addItems(members)
		} else if (typeof members === 'object') {
			addItems([members])
		}

		state.items = _.uniqBy(items, 'id')
	}
}

export type MembersFetchAction = (fetchOptions?: any) => Promise<any>
export type MembersFetchSingleAction = (memberId: number) => Promise<any>
export type MembersAddAction = (memberData?: any) => Promise<any>

// action
export const actions: ActionTree<MembersState, RootState> = {
	fetch(ctx, filters: any = {}) {
		const params: any = {}
		Object.assign(params, filters)

		let key: keyof any
		for (key in params) {
			if (!params[key]) delete params[key]
		}

		if (params.start_date) {
			const start_date = this.$moment(params.start_date).format('YYYY-MM-DD')

			params.start_date = start_date
			if (!params.end_date) params.end_date = start_date
		}

		return this.$api.$get('members/', { params }).then(data => {
			if (data.results) ctx.commit('add', data.results)
			else if (data.data) ctx.commit('add', data.data)
			return data
		})
	},

	fetch_single(ctx, membersId: number) {
		const existing = ctx.state.items[membersId]
		return new Promise((resolve, reject) => {
			if (existing) resolve(ctx.state.items[membersId])

			this.$api
				.$get(`members/${membersId}`)
				.then(data => {
					ctx.commit('add', data)
					resolve(data)

					if (data.location) {
						ctx.commit('locations/add', data.location, { root: true })
					}
				})
				.catch(reject)
		})
	},

	add_member(ctx, memberData: any) {
		return new Promise((resolve, reject) => {
			this.$api
				.$post('members', memberData)
				.then(data => {
					ctx.commit('add', data)
					resolve(data)
				})
				.catch(reject)
		})
	},

	delete_member(ctx, memberId: number) {
		return new Promise((resolve, reject) => {
			this.$api
				.$delete(`members/${memberId}/cancel`)
				.then(data => {
					ctx.commit('add', data)
					resolve(data)
				})
				.catch(reject)
		})
	}
}
