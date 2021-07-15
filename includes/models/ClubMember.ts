import { Vue, Component } from 'nuxt-property-decorator'

export module ClubMember {
	export interface Data {}

	export const Default = {
		id: 0
	}

	export function create(data?: Partial<ClubMember.Data>): ClubMember.Data {
		return Object.assign(ClubMember.Default, data)
	}

	@Component
	export class Mixin extends Vue {
		the_club_member!: ClubMember.Data

		get club_member() {
			return this.the_club_member
		}

		set club_member(v: ClubMember.Data) {
			this.the_club_member = v
		}
	}
}

export default ClubMember
