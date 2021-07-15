<script lang="ts">
import { PostData } from '@store/posts'
import { Vue, Component, Prop } from 'nuxt-property-decorator'

@Component
export default class PostCard extends Vue {
	@Prop({ type: Object, required: true }) post!: PostData

	get cardStyles() {
		const post = this.post

		return {
			'no-media': !post.media
		}
	}

	get postDateTime() {
		return this.$moment(this.post.post_date)
	}

	get startDate() {
		return this.postDateTime.format('MMMM D, YYYY')
	}

	get startTime() {
		return this.postDateTime.format('h:mm a')
	}

	get link() {
		const post = this.post
		if ((post.event && post.article) || (!post.event && !post.article)) {
			return false
		} else if (post.event) {
			return `/events/${post.event.id}`
		} else if (post.article) {
			return `/articles/${post.article.slug}`
		}
	}

	goto() {
		if (this.link) {
			this.$router.push(this.link)
		}
	}
}
</script>

<template>
	<card class="post" :class="cardStyles" @click.native="goto">
		<club-media
			v-if="post.media"
			:media="post.media"
			size="medium"
			class="post-media"
		/>

		<h3 class="details-title post-title">{{ post.title }}</h3>

		<div v-if="link" class="details-actions post-actions">
			<!-- <form-button class="action favorite-item icon flat">
				<i class="far fa-star"></i>
			</form-button> -->

			<nuxt-link class="action more-details" :to="link">
				<form-button class="flat outline">
					{{ post.button_text || 'Details' }}
					<i class="fas fa-chevron-right"></i>
				</form-button>
			</nuxt-link>
		</div>

		<div class="details-datetime post-date">
			<span class="date">{{ startDate }}</span>
			<div class="dot" />
			<span class="time">{{ startTime }}</span>
		</div>

		<div
			v-if="post.snippet"
			class="details-description post-snippet"
			v-html="post.snippet"
		/>
	</card>
</template>

<style lang="scss" scoped>
@import '@sassy';

.card.post::v-deep {
	.card-content {
		@include flex(row, flex-start, stretch);
	}
}

.card.post {
	display: grid;

	z-index: 1;
	transform: scale(0.95);
	transition: transform 0.25s;

	cursor: pointer;

	$media-size: var(--media-size, 125px);
	.post-media {
		width: $media-size;
		height: $media-size;
		object-fit: cover;
		border-radius: $border-radius;
	}

	.post-snippet {
		margin: 0px;
	}

	.post-actions {
		@include flex(row, flex-end);

		.more-details {
			.form-button {
				border: none;
				padding: 0.5em;

				i {
					margin-left: 0.25em;
				}
			}
		}
	}

	&:hover {
		transform: scale(0.99);
		z-index: 99999;
		position: relative;
	}

	// Grid Positioning
	grid-template-columns: calc(#{$media-size} + 0.5em) 1fr auto;
	column-gap: 0.5em;

	grid-template-rows: auto auto 1fr;
	row-gap: 0.25em;

	// with actions in top right
	// grid-template-areas:
	// 	'media title actions'
	// 	'media date actions'
	// 	'media snippet snippet'
	// 	'media link link';

	// with actions below snippet
	grid-template-areas:
		'media title actions'
		'media date actions'
		'media snippet snippet';

	// start at -> end at
	.post-media {
		// row 1, column 1 -> row 4, column 2
		// grid-area: 1 / 1 / 4 / 2;
		grid-area: media;
	}

	.post-title {
		// row 1, column 2 -> row 1, column 3
		// grid-area: 1 / 2 / 1 / 3;
		grid-area: title;
	}

	.post-actions {
		// row 1, column 3 -> row 4, column 4
		// grid-area: 1 / 3 / 4 / 4;
		grid-area: actions;
	}

	.post-date {
		// row 2, column 2 -> row 2, column 2
		// grid-area: 2 / 2 / 2 / 2;
		grid-area: date;
	}

	.post-snippet {
		// row 3, column 2 -> row 3, column 4
		// grid-area: 3 / 2 / 3 / 4;
		grid-area: snippet;
	}

	// .more-details {
	// 	grid-area: link;
	// 	justify-self: end;
	// }

	// Alternative Styles
	&.no-media {
		grid-template-columns: auto 1fr;
		grid-template-areas:
			'title actions'
			'date actions'
			'snippet snippet';
	}

	@include mobile(600px) {
		--media-size: 100px;
		// grid-template-rows: auto auto 1fr;
		// grid-template-areas:
		// 	'media title date'
		// 	'media snippet snippet'
		// 	'media actions actions';

		@include mobile(450px) {
			grid-template-columns: 1fr auto;
			grid-template-rows: auto auto auto 1fr;
			grid-template-areas:
				'media media'
				'title actions'
				'date actions'
				'snippet snippet';

			.post-media {
				width: 100%;
				height: 100px;
			}

			@include mobile(375px) {
				grid-template-rows: auto auto auto 1fr auto;
				grid-template-areas:
					'media media'
					'title title'
					'date date'
					'snippet snippet'
					'actions actions';

				&,
				&.no-media {
					grid-template-columns: auto;
				}

				&.no-media {
					grid-template-rows: auto auto 1fr auto;
					grid-template-areas:
						'title title'
						'date date'
						'snippet snippet'
						'actions actions';
				}
			}
		}
	}
}
</style>
