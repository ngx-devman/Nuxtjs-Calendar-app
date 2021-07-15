<script lang="ts">
import ClubArticle from '@includes/models/ClubArticle'
import { Vue, Component, Prop, PropSync } from 'nuxt-property-decorator'

@Component
export default class ArticleDatetime extends ClubArticle.Mixin {
	@PropSync('article', { type: Object, required: true })
	the_club_article!: ClubArticle.Data

	get post_date() {
		return this.club_article_date_moment.format('MMMM D, YYYY')
	}

	get post_time() {
		return this.club_article_date_moment.format('h:mm a')
	}
}
</script>

<template>
	<div class="article-datetime">
		<span class="date">
			{{ post_date }}
		</span>

		<div class="dot" />

		<span class="time">
			{{ post_time }}
		</span>
	</div>
</template>

<style lang="scss" scoped>
@import '@sassy';

.article-datetime {
	@include flex(row, flex-start, center);
	grid-area: articledatetime;

	.dot {
		@include flex(column, center, center);
		margin: 0px 0.5em;
		align-self: stretch;

		&:after {
			content: '';
			width: 5px;
			height: 5px;
			background-color: var(--article-datetime-dot-color, $color-primary);
			border-radius: 100%;
		}
	}

	.date,
	.time {
		@include flex(row, flex-start, center);
	}
}
</style>
