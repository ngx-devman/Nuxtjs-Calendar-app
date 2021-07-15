<script lang="ts">
import { ArticlesFetchSingleAction } from '@store/articles'
import { Vue, Component, Prop, Action } from 'nuxt-property-decorator'

@Component
export default class ArticleCard extends Vue {
	@Prop({ type: Object, required: true }) article!: any
	@Action('articles/fetch_single') fetchSingle!: ArticlesFetchSingleAction

	extra: any = false

	fetch() {
		if (!this.article) return
		return this.fetchSingle(this.article.slug).then(d => {
			this.extra = d
		})
	}

	get articleDateTime() {
		return this.$moment(this.article.post_date)
	}

	get startDate() {
		return this.articleDateTime.format('MMMM D, YYYY')
	}

	get startTime() {
		return this.articleDateTime.format('h:mm a')
	}

	get barColor() {
		if (!this.extra || !this.extra.categories || !this.extra.categories.length)
			return '#c5d0a6'
		return this.extra.categories[0].color
	}
}
</script>

<template>
	<card-colored-bar class="card-article" :color="barColor">
		<img
			v-if="article.media && article.media.url"
			:src="article.media.url"
			alt=""
			class="article-image"
		/>

		<div class="article-details">
			<div class="details-header">
				<div class="details-title-datetime">
					<div class="details-datetime">
						<span class="date">{{ startDate }}</span>
						<div class="dot" />
						<span class="time">{{ startTime }}</span>
					</div>

					<h3 class="details-title">{{ article.title }}</h3>
				</div>

				<div class="details-actions">
					<form-button class="action favorite-item icon flat">
						<i class="far fa-star"></i>
					</form-button>

					<nuxt-link
						class="action more-details"
						:to="`/articles/${article.id}`"
					>
						<form-button class="flat outline">
							Details <i class="fas fa-chevron-right"></i>
						</form-button>
					</nuxt-link>
				</div>
			</div>

			<!-- <div v-if="extra.location" class="details-location">
				<i class="fas fa-map-marker-alt"></i>
				<span>{{ extra.location.title }}</span>
			</div> -->

			<div
				v-if="extra.snippet"
				class="details-description"
				v-html="extra.snippet"
			/>
		</div>
	</card-colored-bar>
</template>

<style lang="scss" scoped>
@import '@sassy';

.card-article::v-deep {
	.card-content {
		@include flex(row, flex-start, stretch);
	}
}

.card {
	z-index: 1;
	transform: scale(0.95);
	transition: transform 0.25s;

	.article-image {
		width: 125px;
		height: 125px;
		object-fit: cover;
		margin-right: 20px;
		border-radius: $border-radius;
	}

	.article-details {
		width: 100%;

		.details-actions {
			flex-shrink: 0;

			.more-details {
				display: block;
				margin-left: 0.5em;

				.flat.outline {
					border: none;
					padding: 0.85em 0.5em;
				}
			}
		}

		.details-description {
			font-size: 0.9em;
		}
	}
}

.card:hover {
	transform: scale(0.99);
	z-index: 99999;
	position: relative;
}
</style>
