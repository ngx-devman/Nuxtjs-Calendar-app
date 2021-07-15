import { Vue, Component, Provide } from 'nuxt-property-decorator'

export module ClubMedia {
	export interface Data {
		ext: string
		id: string | number
		name: string
		url: null | {
			full_size: string
			big: string
			medium: string
			small: string
		}
	}

	export const Default = {
		ext: '',
		id: 0,
		name: '',
		url: null
	}

	export function create(data?: Partial<ClubMedia.Data>): ClubMedia.Data {
		const defaultObj = ClubMedia.Default as any
		return { ...defaultObj, ...data }
	}

	export const ProvideIt = 'media'
	export const InjectIt = { from: ProvideIt, default: ClubMedia.create() }

	@Component
	export class Mixin extends Vue {
		the_club_media!: ClubMedia.Data | null

		@Provide(ProvideIt)
		get club_media() {
			return this.the_club_media
		}

		set club_media(v: ClubMedia.Data | null) {
			this.the_club_media = v
		}

		getClubMediaSrcSet(media: ClubMedia.Data) {
			if (!media.url) return ''
			const urls = media.url
			return [
				urls.small + ' 100w',
				urls.medium + ' 400w',
				urls.big + ' 700w'
			].join(', ')
		}
	}
}

export default ClubMedia
