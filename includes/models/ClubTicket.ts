import {
	Vue,
	Component,
	Provide,
	PropSync,
	InjectReactive
} from 'nuxt-property-decorator'
import ClubMedia from './ClubMedia'

export module ClubTicket {
	export interface Data {
		id: number
		media: ClubMedia.Data
		title: string
		subtitle: string
		quantity: number | string
	}

	export const Default = {
		id: 0,
		media: ClubMedia.create(),
		title: '',
		subtitle: '',
		quantity: 0
	}

	export function create(data?: Partial<ClubTicket.Data>): ClubTicket.Data {
		const defaultObj = ClubTicket.Default as any
		return { ...defaultObj, ...data }
	}

	export const ProvideIt = 'ticket'
	export const InjectIt = { from: ProvideIt, default: ClubTicket.create() }

	@Component
	export class Mixin extends Vue {
		// Single
		the_club_ticket!: ClubTicket.Data

		@PropSync('ticket')
		the_club_ticket_prop!: ClubTicket.Data

		@InjectReactive(ProvideIt)
		the_club_ticket_inject!: ClubTicket.Data

		// Multiple
		the_club_tickets!: ClubTicket.Data[]

		@PropSync('tickets')
		the_club_tickets_prop!: ClubTicket.Data[]

		@InjectReactive('tickets')
		the_club_tickets_inject!: ClubTicket.Data[]

		// Mappers
		@Provide(ProvideIt)
		get club_ticket() {
			return (
				this.the_club_ticket_prop ||
				this.the_club_ticket_inject ||
				this.the_club_ticket
			)
		}

		set club_ticket(v: ClubTicket.Data) {
			if (this.the_club_ticket_prop) this.the_club_ticket_prop = v
			else if (this.the_club_ticket_inject) this.the_club_ticket_inject = v
			else this.the_club_ticket = v
		}

		@Provide('tickets')
		get club_tickets() {
			return (
				this.the_club_tickets_prop ||
				this.the_club_tickets_inject ||
				this.the_club_tickets
			)
		}

		set club_tickets(v) {
			if (this.the_club_ticket_prop) this.the_club_tickets_prop = v
			else if (this.the_club_ticket_inject) this.the_club_tickets_inject = v
			else this.the_club_tickets = v
		}
	}
}

export default ClubTicket
