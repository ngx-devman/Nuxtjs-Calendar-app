import _ from 'lodash'
import {
	Vue,
	Component,
	Provide,
	ProvideReactive
} from 'nuxt-property-decorator'
import ClubTicket from './ClubTicket'

export module ClubEventTicket {
	export interface Data {
		id: number
		inventory: number
		maximum_purchase: number
		price: number
		ticket: ClubTicket.Data
	}

	export const Default = {
		id: 0,
		inventory: 0,
		maximum_purchase: 0,
		price: 0,
		ticket: ClubTicket.create()
	}

	export function create(data?: Partial<Data>): Data {
		if (data?.ticket) data.ticket = ClubTicket.create(data.ticket)
		return _.defaultsDeep(data, Default)
	}

	export const ProvideIt = 'ticket'
	export const InjectIt = { from: ProvideIt, default: create() }

	@Component
	export class Mixin extends ClubTicket.Mixin {
		the_club_event_ticket!: Data

		@Provide(ProvideIt)
		get club_event_ticket() {
			return this.the_club_event_ticket
		}

		set club_event_ticket(v) {
			this.the_club_event_ticket = v
		}

		@ProvideReactive(ClubTicket.ProvideIt)
		get club_ticket() {
			return this.club_event_ticket.ticket
		}

		set club_ticket(v) {
			this.club_event_ticket.ticket = v
		}

		get club_event_ticket_price_display() {
			return Intl.NumberFormat(undefined, {
				style: 'currency',
				currency: 'USD'
			}).format(this.club_event_ticket.price)
		}
	}
}

export default ClubEventTicket
