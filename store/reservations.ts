import _ from 'lodash'
import Vue from 'vue'
import { GetterTree, ActionTree, MutationTree } from 'vuex'
import { Action, Component, Watch } from 'nuxt-property-decorator'
import ClubReservation from '@includes/models/ClubReservation'
import ClubEvent from '@includes/models/ClubEvent'
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

export type ReservationsState = {
	items: any[]
}

// getter
export const getters: GetterTree<ReservationsState, RootState> = {
	items(state) {
		return state.items
	}
}

export type ReservationSetMutation = (items: any | any[]) => void

// mutation
export const mutations: MutationTree<ReservationsState> = {
	set(state, reservations: any[]) {
		state.items = reservations
	},
	add(state, reservations: any | any[]) {
		const items = state.items

		const addItems = (e: any[]) =>
			e.forEach(e => {
				if (!e.id) return
				const existing = items.findIndex(i => i.id === e.id)

				if (existing > -1) {
					items[existing] = Object.assign(items[existing], e)
				} else items.push(e)
			})

		if (Array.isArray(reservations)) {
			addItems(reservations)
		} else if (typeof reservations === 'object') {
			addItems([reservations])
		}

		state.items = _.uniqBy(items, 'id')
	}
}

export type ReservationFetchPayload = {
	filters?: any
	replace?: boolean
}
export type ReservationsFetchAction = (
	fetchOptions?: ReservationFetchPayload
) => Promise<any>
export type ReservationsFetchSingleAction = (
	reservationId: number
) => Promise<any>
export type ReservationsCreateAction = (
	reservationData: ClubReservation.Data
) => Promise<ClubReservation.Data>
export type ReservationCancelAction = (reservationId?: number) => Promise<any>

// action
export const actions: ActionTree<ReservationsState, RootState> = {
	fetch(ctx, payload: ReservationFetchPayload = { replace: true }) {
		const replace = payload.replace
		const params: any = {}
		Object.assign(params, payload.filters)

		let key: keyof any
		for (key in params) {
			if (!params[key]) delete params[key]
			else if (Array.isArray(params[key])) params[key] = params[key].join(',')
		}

		if (params.start_date) {
			const start_date = this.$moment(params.start_date).format('YYYY-MM-DD')

			params.start_date = start_date
			if (!params.end_date) params.end_date = start_date
		}

		params.ordering = 'event__start_date'
		return this.$api.$get('reservations/', { params }).then(res => {
			const data = res.data.map(ClubReservation.create)

			if (replace) ctx.commit('set', data)
			else ctx.commit('add', data)
			return data
		})
	},

	fetch_owned(ctx, payload: ReservationFetchPayload = { replace: true }) {
		const params: any = {}
		Object.assign(params, payload.filters)

		let key: keyof any
		for (key in params) {
			if (!params[key]) delete params[key]
			else if (Array.isArray(params[key])) params[key] = params[key].join(',')
		}

		if (params.start_date) {
			const start_date = this.$moment(params.start_date).format('YYYY-MM-DD')

			params.start_date = start_date
			if (!params.end_date) params.end_date = start_date
		}

		return this.$api
			.$get('reservations/my/', { params })
			.then(({ data }) => data.map(ClubReservation.create))
	},

	fetch_single(ctx, reservationsId: number) {
		const existing = ctx.state.items[reservationsId]
		return new Promise((resolve, reject) => {
			if (existing) resolve(ctx.state.items[reservationsId])

			this.$api
				.$get(`reservations/${reservationsId}/`)
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

	create(ctx, reservationData: ClubReservation.Data) {
		return this.$api.$post('reservations/', reservationData).then(data => {
			ctx.commit('add', data)
			return data
		})
	},

	delete_reservation(ctx, reservationId: number) {
		return this.$api
			.$delete(`reservations/${reservationId}/cancel/`)
			.then(data => {
				ctx.commit('add', data)
				return data
			})
	}
}
