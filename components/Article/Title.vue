<script lang="ts">
import ClubArticle from '@includes/models/ClubArticle'
import { Vue, Component, PropSync, Prop } from 'nuxt-property-decorator'

@Component
export default class ArticleTitle extends ClubArticle.Mixin {
	@PropSync('article', { type: Object, required: true })
	the_club_article!: ClubArticle.Data

	@Prop({ type: String, default: '3' })
	level!: string

	render(createElement: Vue.CreateElement) {
		return createElement(
			'h' + this.level,
			{ class: 'article-title' },
			this.club_article.title
		)
	}
}
</script>

<style lang="scss" scoped>
@import '@sassy';

.article-title {
	grid-area: articletitle;

	font-family: $lato-font;
	font-weight: 800;
}
</style>
