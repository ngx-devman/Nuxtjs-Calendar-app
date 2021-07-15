<script lang="ts">
import ClubArticle from '@includes/models/ClubArticle'
import { Vue, Component, PropSync } from 'nuxt-property-decorator'

@Component
export default class ArticleContent extends ClubArticle.Mixin {
	@PropSync('article', { type: Object, required: true })
	the_club_article!: ClubArticle.Data
}
</script>

<template>
	<div class="article-content" v-html="club_article.text" />
</template>

<style lang="scss" scoped>
@import '@sassy';
.article-content::v-deep {
	p {
		padding: 0.25em 0px;
	}

	img {
		margin: 1em;
		border-radius: $border-radius;

		@include on-mobile(450px) {
			margin: 1em 0px;
			width: 100%;
			height: unset !important;
			float: none;
			object-fit: contain;
			object-position: center;
		}
	}
}

.article-content {
	grid-area: articlecontent;
	width: 100%;
	max-height: 100%;
	// max-height: 90px;
	overflow: hidden;
	overflow-y: auto;
	padding-right: 10px;
	// border-radius: $border-radius;
	--scrollbar-size: 4px;

	.article-flyer {
		margin-top: 1em;
		margin-bottom: 1em;
		border-radius: $border-radius;
	}

	@include on-mobile {
		--scrollbar-size: 2px;
		padding-right: 2px;
	}
}
</style>
