import { ReservationsCreateAction } from '@store/reservations'
import _ from 'lodash'
import {
	InjectReactive,
	PropSync,
	ProvideReactive
} from 'nuxt-property-decorator'
import Component, { mixins } from 'vue-class-component'
import { Action } from 'vuex-class'
import ClubEvent from './ClubEvent'
import ClubEventTicket from './ClubEventTicket'
import ClubTicket from './ClubTicket'

export module ClubReservation {
	export interface Data {
		event: ClubEvent.Data
		time_slot: ClubEvent.TimeSlot[]
		guests: any[]
		form_answers: any[]
		tickets: ClubEventTicket.Data[]
	}

	export const Default = {
		event: ClubEvent.create(),
		time_slot: null,
		guests: [],
		form_answers: [],
		tickets: []
	}

	export function create(
		data?: Partial<ClubReservation.Data>
	): ClubReservation.Data {
		return _.defaultsDeep(data, Default)
	}

	export const ProvideIt = 'reservation'
	export const InjectIt = {
		from: 'reservation',
		default: create()
	}

	@Component
	export class Mixin extends mixins(ClubEvent.Mixin, ClubTicket.Mixin) {
		@Action('reservations/create') _createReservation!: ReservationsCreateAction

		// Single
		the_club_reservation!: Data

		// Multiple
		the_club_reservations!: Data[]

		// Toggles
		map_reservation_tickets_from_event!: boolean

		// Mappers
		get club_reservation() {
			return this.the_club_reservation
		}

		set club_reservation(v) {
			this.the_club_reservation = v
		}

		get club_event() {
			return this.club_reservation.event
		}

		set club_event(v: ClubEvent.Data) {
			this.club_reservation.event = v
		}

		get club_reservation_tickets() {
			const tickets = this.club_reservation.tickets
			if (!this.map_reservation_tickets_from_event) return tickets
			if (
				!this.club_reservation.tickets ||
				!this.club_reservation.tickets.length
			)
				this.club_reservation.tickets = this.club_event_tickets.map((t, i) =>
					_.defaultsDeep(tickets[i] || {}, t)
				)
			return this.club_reservation.tickets
		}

		set club_reservation_tickets(v) {
			this.club_reservation.tickets = v
		}

		get club_event_tickets() {
			return (
				this.club_reservation.event.event_tickets || super.club_event_tickets
			)
		}

		set club_event_tickets(v) {
			this.club_reservation.event.event_tickets = v
		}

		get club_tickets() {
			if (!this.club_reservation) return []
			return this.club_reservation.tickets
				? this.club_reservation.tickets.map(t => t.ticket)
				: super.club_tickets
		}

		set club_tickets(v) {
			const rtickets = this.club_reservation_tickets
			v.forEach(t => {
				const rt_index = rtickets.findIndex(i => i.ticket.id === t.id)
				if (rt_index < 0) rtickets.push(ClubEventTicket.create({ ticket: t }))
				rtickets[rt_index].ticket = t
			})
			this.club_reservation_tickets = rtickets
		}

		get club_reservation_selected_tickets() {
			return this.club_reservation_tickets.filter(
				t =>
					t.ticket.quantity &&
					!isNaN(Number(t.ticket.quantity)) &&
					t.ticket.quantity !== '0'
			)
		}

		// Actions
		$createReservation(reservation?: ClubReservation.Data) {
			if (!reservation) reservation = this.the_club_reservation
			if (!reservation)
				return Promise.reject(new Error('no reservation data provided'))

			const data: any = _.cloneDeep(this.club_reservation)
			const mapField = (f: any) => ({
				field: f.id,
				value: JSON.stringify(f.value)
			})

			data.event = data.event.id
			data.form_answers = data.form_answers.map(mapField)

			data.guests = data.guests.map((guest: any) => {
				guest.form_answers = guest.form_answers.map(mapField)
				return guest
			})

			if (data.tickets) {
				data.tickets = data.tickets.map((t: any) => ({
					event_ticket: t.id,
					quantity: t.ticket.quantity
				}))
			}

			return this._createReservation(data).then(data => {
				return data
			})
		}

		$fetchReservations(params: Record<string, any> = {}) {
			return this.$store.dispatch('reservations/fetch', params)
		}

		club_reservation_questions(t?: 'guests' | 'host'): any[] {
			const event = this.club_event
			if (!event || !event.form) return []
			const fields: any[] = (event.form as any).fields
			return fields.filter(f =>
				t === 'guests' ? f.is_per_attendee : !f.is_per_attendee
			)
		}
	}

	@Component
	export class Source extends mixins(ClubEvent.Source, Mixin) {
		@ProvideReactive(ProvideIt)
		get club_reservation() {
			return this.the_club_reservation
		}

		set club_reservation(v) {
			this.the_club_reservation = v
		}
	}

	@Component
	export class Propped extends Mixin {
		@PropSync(ProvideIt, { type: Object })
		the_club_reservation!: Data
	}

	@Component
	export class ProppedSource extends mixins(Propped, Source) {}

	@Component
	export class Injected extends Mixin {
		@InjectReactive(InjectIt)
		the_club_reservation!: Data
	}

	@Component
	export class InjectedSource extends mixins(Injected, Source) {}
}

export default ClubReservation
