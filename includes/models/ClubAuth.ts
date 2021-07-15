import { Vue, Component } from 'nuxt-property-decorator'
import ClubLocation from './ClubLocation'

export module ClubAuth {
	export interface Data {
		id: number
		app_data: any
		birthday: string
		city: string | null
		email: string
		first_name: string
		last_name: string
		location: ClubLocation.Data
		member_id: string
		state: string | null
		status?: {
			description: string
			id: number
			title: string
		}
		token: {
			access: string
			refresh: string
		}
		zip_code: string | null
	}

	export const Default = {
		id: 0,
		app_data: {},
		birthday: new Date().toUTCString(),
		city: false,
		email: '',
		first_name: '',
		last_name: '',
		location: false,
		member_id: '',
		state: false,
		status: false,
		token: false,
		zip_code: false
	}

	export function create(data?: Partial<Data>): Data {
		const defaultObj = Default as any
		return { ...defaultObj, ...data }
	}

	@Component
	export class Mixin extends Vue {
		get user() {
			return this.$store.getters['auth/user']
		}

		set user(v: ClubAuth.Data) {
			this.$store.commit('auth/user', v)
		}
	}
}

export default ClubAuth
