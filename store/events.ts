import ClubEvent from '@includes/models/ClubEvent'
import _ from 'lodash'
import Vue from 'vue'
import Component from 'vue-class-component'
import { GetterTree, ActionTree, MutationTree } from 'vuex'
import { RootState } from './index'

export interface APIListResult {
	count: number
	next: string
	previous: string
	data?: any[]
	results?: any[]
}

/**
 * moved to @includes/models/ClubEvents
 * @deprecated v0.6
 */
@Component
export class ClubEvents extends Vue {
	club_event!: ClubEvent.Data

	get club_event_start_moment() {
		return this.$moment(this.club_event.start_date)
	}

	get club_event_end_moment() {
		return this.$moment(this.club_event.end_date)
	}

	get club_event_is_future() {
		return this.$moment().isBefore(this.club_event.start_date)
	}
}

export const state = () => ({
	items: [],
	spaces: []
})

export type EventsState = {
	items: any[]
	spaces: any[]
}

export const getters: GetterTree<EventsState, RootState> = {
	items(state) {
		return state.items
	}
}

export const mutations: MutationTree<EventsState> = {
	add(state, events: any | any[]) {
		const items = state.items

		const addItems = (e: any[]) =>
			e.forEach(e => {
				if (!e.id) return
				const existing = items.findIndex(i => i.id === e.id)

				if (existing > -1) {
					items[existing] = Object.assign(items[existing], e)
				} else items.push(e)
			})

		if (Array.isArray(events)) {
			addItems(events)
		} else if (typeof events === 'object') {
			addItems([events])
		}

		state.items = _.uniqBy(items, 'id')
	}
}

export type EventsFetchAction = (fetchOptions?: any) => Promise<any>
export type EventsFetchSingleAction = (eventId: number) => Promise<any>

export const actions: ActionTree<EventsState, RootState> = {
	fetch(ctx, filters: any = {}) {
		const params: any = {}
		Object.assign(params, filters)

		let key: keyof any
		for (key in params) {
			if (!params[key] || (Array.isArray(params[key]) && !params[key].length))
				delete params[key]
		}

		if (params.start_date) {
			const start_date = this.$moment(params.start_date).format('YYYY-MM-DD')

			params.start_date = start_date
			// if (!params.end_date) params.end_date = start_date
		}

		if (params.locations && Array.isArray(params.locations)) {
			params.locations = params.locations
				.map((l: any) => {
					if (typeof l === 'object' && l.id) {
						return l.id
					} else if (typeof l === 'number') {
						return l
					} else return false
				})
				.filter((i: any) => i)
				.join(',')
		}

		if (params.categories && Array.isArray(params.categories)) {
			params.categories = params.categories
				.map((c: any) => {
					if (typeof c === 'object' && c.id) {
						return c.id
					} else if (typeof c === 'number') {
						return c
					} else return false
				})
				.filter((i: any) => i)
				.join(',')
		}

		if (ctx.rootGetters.favoritesFeed) {
			const ids = ctx.rootGetters['auth/favorite_events']
			if (ids || Array.isArray(ids)) {
				params.ids = ids.join(',')
			}
		}

		params.ordering = 'start_date'
		return this.$api.$get('events/', { params }).then(data => {
			let events: any

			if (data.results) events = data.results
			else if (data.data) events = data.data

			return events.map(ClubEvent.create)
		})
	},
	fetch_single(ctx, eventId: number) {
		return this.$api.$get(`events/${eventId}/`).then(ClubEvent.create)
	},
	fetch_guests(ctx, options) {
		return this.$api
			.$get(`events/${options.event.id}/guests/`, {
				params: options.filters
			})
			.then(res => res.data)
	}
}
