import { Vue, Component } from 'nuxt-property-decorator'
import ClubMedia from './ClubMedia'

export module ClubArticle {
	export interface Data {
		id: number
		post_date: string
		slug: string
		text: string
		title: string
		media: null | ClubMedia.Data
	}

	export const Default = {
		id: 0,
		post_date: new Date().toUTCString(),
		slug: '',
		text: '',
		title: '',
		media: null
	}

	export function create(data?: Partial<ClubArticle.Data>): ClubArticle.Data {
		const defaultObj = ClubArticle.Default as any
		return { ...defaultObj, ...data }
	}

	@Component
	export class Mixin extends Vue {
		the_club_article!: ClubArticle.Data

		get club_article() {
			return this.the_club_article
		}

		set club_article(v: ClubArticle.Data) {
			this.the_club_article = v
		}

		get club_article_date_moment() {
			return this.$moment(this.club_article.post_date)
		}
	}
}

export default ClubArticle
