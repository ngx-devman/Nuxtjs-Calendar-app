<script lang="ts">
import ClubArticle from '@includes/models/ClubArticle'
import ClubReservation from '@includes/models/ClubReservation'
import {
	Component,
	Action,
	Getter,
	PropSync,
	Watch
} from 'nuxt-property-decorator'

@Component
export default class ArticleDetailsHeader extends ClubArticle.Mixin {
	@PropSync('article', { type: Object, required: true })
	the_club_article!: ClubArticle.Data
}
</script>

<template>
	<card class="article-details">
		<club-media
			v-if="club_article.media && club_article.media.url"
			:media="club_article.media"
			:title="club_article.title"
			size="medium"
			class="article-media"
			openable
		/>

		<article-title level="1" :article="club_article" />
		<article-datetime :article="club_article" />
		<article-content :article="club_article" />
	</card>
</template>

<style lang="scss" scoped>
@import '@sassy';

.card.article-details {
	@include grid(
		140px 1fr auto,
		auto auto minmax(0, 1fr),
		'articlemedia articletitle articledatetime'
			'articlemedia articlecontent articlecontent'
			'. articlecontent articlecontent'
	);
	align-items: start;
	gap: 0.5em;

	@include glass-it(
		linear-gradient(
			90deg,
			rgba(255, 255, 255, 0.65) 0%,
			rgba(211, 247, 255, 0.98) 100%
		),
		20px
	);

	.article-media {
		grid-area: articlemedia;

		width: 130px;
		height: 130px;
		object-fit: cover;
		border-radius: $border-radius;
	}

	.article-datetime {
		font-size: 0.85em;
		white-space: nowrap;
	}

	@include on-mobile(600px) {
		display: block;

		.article-media {
			width: 80px;
			height: 80px;
			float: right;
			margin-left: 1em;
			margin-bottom: 1em;
		}

		.article-title {
			font-size: 1.2em;
		}

		.article-content {
			display: contents;
		}
	}
}
</style>
