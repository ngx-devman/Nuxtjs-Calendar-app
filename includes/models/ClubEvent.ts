import {
	Vue,
	Component,
	mixins,
	Provide,
	Inject,
	ProvideReactive,
	InjectReactive,
	PropSync
} from 'nuxt-property-decorator'
import _ from 'lodash'
import ClubMedia from './ClubMedia'
import ClubLocation from './ClubLocation'
import ClubAuth from './ClubAuth'
import ClubEventTicket from './ClubEventTicket'

export module ClubEvent {
	export interface Attendee {
		id: number
		email: string | null
		age_type: string | null
		is_anonymous: boolean
		is_host: boolean
		name: string | null
		member: null | {
			email: string
			first_name: string
			id: number
			last_name: string
			member_id: string
			sex: string
		}
	}

	export interface TimeSlot {
		available_seats: number
		capacity: number
		end_date: string
		id: number
		start_date: string
		title: string
	}

	export interface Data {
		available_spaces: number
		categories: any
		description: string
		end_date: string
		event_tickets: ClubEventTicket.Data[]
		flyer?: ClubMedia.Data
		form?: any
		has_online_reservation: boolean
		has_public_list: boolean
		has_waitlist: boolean
		is_location_restrict: boolean
		id: number
		is_allday: boolean
		is_allowed_guests: boolean
		locations: ClubLocation.Data[]
		max_capacity: number
		max_per_reservation: number
		media: ClubMedia.Data
		min_per_reservation: number
		price: number
		purchase_cutoff_datetime: string
		snippet: string
		start_date: string
		status: string
		time_slots: TimeSlot[]
		title: string
		total_reservations: number
		guests: Attendee[]
		reservation_start: string
		reservation_end: string
		foretees_event_name: string | null
	}

	export const Default = {
		available_spaces: 0,
		categories: [],
		description: '',
		end_date: new Date().toUTCString(),
		event_tickets: [],
		flyer: false,
		form: false,
		has_online_reservation: false,
		has_public_list: false,
		has_waitlist: false,
		id: 0,
		is_allday: false,
		is_allowed_guests: false,
		is_location_restrict: false,
		locations: [],
		max_capacity: 0,
		max_per_reservation: 0,
		media: false,
		min_per_reservation: 0,
		price: 0,
		purchase_cutoff_datetime: new Date().toUTCString(),
		snippet: '',
		start_date: new Date().toUTCString(),
		status: '',
		time_slots: [],
		title: '',
		total_reservations: 0,
		guests: [],
		reservation_start: false,
		reservation_end: false,
		foretees_event_name: false
	}

	export function create(data?: Partial<Data>): Data {
		if (data?.event_tickets)
			data.event_tickets = data.event_tickets.map(ClubEventTicket.create)
		return _.defaultsDeep(data, Default)
	}

	export const ProvideIt = 'event'
	export const InjectIt = { from: ProvideIt, default: create() }

	@Component
	export class Mixin extends ClubAuth.Mixin {
		the_club_event!: Data

		// Data Maps

		get club_event() {
			return this.the_club_event
		}

		set club_event(v: Data) {
			this.the_club_event = v
		}

		get club_location() {
			return this.club_event.locations
		}

		set club_location(v) {
			this.club_event.locations = v
		}

		get club_media() {
			return this.club_event.media
		}

		set club_media(v) {
			this.club_event.media = v
		}

		get club_event_tickets() {
			return this.club_event.event_tickets
		}

		set club_event_tickets(v) {
			this.club_event.event_tickets = v
		}

		// Properties Map

		get club_event_start_moment() {
			return this.$moment(this.club_event.start_date)
		}

		get club_event_end_moment() {
			return this.$moment(this.club_event.end_date)
		}

		get club_event_favorite_text() {
			if (this.club_event_is_favorite) return 'remove from my favorite events'
			else return 'add to my favorite events'
		}

		get club_event_reservation_start_moment() {
			return this.$moment(this.club_event.reservation_start)
		}

		get club_event_reservation_end_moment() {
			return this.$moment(this.club_event.reservation_end)
		}

		// User Properties Map

		get user_favorite_club_events(): number[] {
			return this.$store.getters['auth/favorite_event']
		}

		// Data Checks

		get club_event_is_ticket_only() {
			const { club_event, club_event_tickets } = this
			return !club_event.form && club_event_tickets.length
		}

		get club_event_is_favorite(): boolean {
			return this.user_favorite_club_events.includes(this.club_event.id)
		}

		get club_event_has_spaces() {
			const event = this.club_event
			return (
				event.available_spaces > 0 ||
				event.available_spaces === null ||
				event.has_waitlist
			)
		}

		get club_event_is_future() {
			return this.$moment().isBefore(this.club_event.start_date)
		}

		get club_event_reservation_is_available() {
			return (
				this.club_event.has_online_reservation &&
				this.current_time_between_reservation_start_end &&
				this.club_event_is_future &&
				this.club_event_has_spaces
			)
		}

		// User Data Checks

		get user_at_club_event_location() {
			const locations = this.club_event.locations
			const user = this.user
			return locations.map(l => l.id).includes(user.location.id)
		}

		get user_can_make_reservation() {
			const { club_event, user_at_club_event_location } = this
			const is_restricted = club_event.is_location_restrict
			return !is_restricted || (is_restricted && user_at_club_event_location)
		}

		get current_time_between_reservation_start_end() {
			const [start, end, now] = [
				this.club_event_reservation_start_moment,
				this.club_event_reservation_end_moment,
				this.$moment()
			]

			if (start.isValid() && end.isValid()) return now.isBetween(start, end)
			else if (start.isValid()) return now.isAfter(start)
			else if (end.isValid()) return now.isBefore(end)
			return true
		}

		// Data Actions

		$fetchClubEvent(id?: number) {
			if (!this.club_event && !id)
				return Promise.reject(new Error('club event not set'))
			if (!id) id = this.club_event.id
			return this.$store.dispatch('events/fetch_single', id).then(data => {
				this.club_event = data
			})
		}

		$fetchClubEventGuests(filters: any = {}) {
			if (!this.club_event)
				return Promise.reject(new Error('club event not set'))
			if (!this.club_event.has_public_list) return Promise.resolve([])

			filters.reservation_status = 'reserved'
			return this.$store
				.dispatch('events/fetch_guests', {
					event: this.club_event,
					filters
				})
				.then(guests => {
					this.club_event.guests = _.uniqBy(
						[...this.club_event.guests, ...guests],
						'id'
					)
					return guests
				})
		}

		$favoriteClubEvent(event?: number[] | number) {
			if (!event) event = this.club_event.id
			return this.$store.dispatch('auth/favorite_event', event)
		}

		$fetchEventReservations() {
			return this.$store.dispatch('reservations/fetch', {
				filters: { events: [this.club_event.id] }
			})
		}

		$fetchOwnedEventReservations(filters: Record<string, any>) {
			return this.$store.dispatch('reservations/fetch_owned', {
				filters: { ...filters, events: [this.club_event.id] }
			})
		}
	}

	@Component
	export class Source extends Mixin {
		@ProvideReactive(ProvideIt)
		get club_event() {
			return this.the_club_event
		}

		set club_event(v) {
			this.the_club_event = v
		}
	}

	@Component
	export class Propped extends Mixin {
		@PropSync(ProvideIt)
		the_club_event!: Data
	}

	@Component
	export class ProppedSource extends mixins(Propped, Source) {}

	@Component
	export class Injected extends mixins(Mixin) {
		@InjectReactive(InjectIt)
		the_club_event!: Data
	}

	@Component
	export class InjectedSource extends mixins(Injected, Source) {}
}

export default ClubEvent
