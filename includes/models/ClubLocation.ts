import { Vue, Component, Provide } from 'nuxt-property-decorator'
import ClubMedia from './ClubMedia'

export module ClubLocation {
	export interface Data {
		id: string | number
		title: string
		media?: ClubMedia.Data
	}

	export const Default = {
		id: 0,
		title: '',
		media: false
	}

	export function create(data?: Partial<ClubLocation.Data>): ClubLocation.Data {
		return { ...(ClubLocation.Default as any), ...data }
	}

	export const ProvideIt = 'location'
	export const InjectIt = {
		from: ProvideIt,
		default: ClubLocation.create()
	}

	@Component
	export class Mixin extends ClubMedia.Mixin {
		the_club_location!: ClubLocation.Data | ClubLocation.Data[]

		@Provide(ProvideIt)
		get club_location() {
			return this.the_club_location
		}

		set club_location(v: ClubLocation.Data | ClubLocation.Data[]) {
			this.the_club_location = v
		}

		get location_titles() {
			if (!this.club_location) return ''
			else if (!Array.isArray(this.club_location))
				return this.club_location.title
			else return this.club_location.map(l => l.title)
		}
	}
}

export default ClubLocation
