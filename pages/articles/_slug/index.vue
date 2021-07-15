<script lang="ts">
import ClubArticle from '@includes/models/ClubArticle'
import { Context } from '@nuxt/types'
import { Component } from 'nuxt-property-decorator'

@Component
export default class PageArticlesSingle extends ClubArticle.Mixin {
	asyncData({ store, params }: Context) {
		const articleID = params.slug
		return store
			.dispatch('articles/fetch_single', articleID)
			.then(data => {
				const the_club_article = ClubArticle.create(data)
				return {
					the_club_article
				}
			})
			.catch(err => {
				console.error('Failed to get article', err)
			})
	}
}
</script>

<template>
	<page class="article-single">
		<div class="page-inner">
			<nuxt-link class="back" to="/">
				<form-button class="flat no-border">
					<span>
						<i class="far fa-chevron-left"></i>
						Back to Calendar
					</span>
				</form-button>
			</nuxt-link>

			<article-details :article="club_article" />
		</div>
	</page>
</template>

<style lang="scss" scoped>
@import '@sassy';

$tablet-width: 1100px;
$mobile-width: 876px;

html::v-deep .layout-body {
	overflow-y: auto;
}

.page.article-single::v-deep {
	.article-details {
		@include on-mobile {
			.article-image {
				width: 100px;
				height: 100px;
			}
		}
	}
}

.page.article-single {
	border-radius: $border-radius;
	overflow: hidden;
	padding-bottom: 0px;

	.page-inner {
		@include grid(1fr 800px 1fr, auto 1fr, '. back .' '. content .');
		height: 100%;

		@include on-mobile {
			@include grid(auto, auto auto, 'back' 'content');
		}
	}

	.back {
		grid-area: back;
		justify-self: end;
		flex-shrink: 0;

		margin-bottom: -$border-radius;

		.form-button {
			@include glass-it(rgba(#000, 0.1));
		}

		span {
			@include flex(row, center, center);
			color: white;
			text-decoration: none;

			i {
				@include flex(column, center, center);
				margin-right: 1em;
				color: white;
				font-size: 1.25em;

				border-radius: 100%;
			}
		}

		@include tablet($tablet-width) {
			align-self: flex-end;
		}
	}

	.article-details {
		overflow: hidden;
		grid-area: content;

		border-bottom-left-radius: 0px;
		border-bottom-right-radius: 0px;

		@media screen and (max-height: 650px), (max-width: $mobile-width) {
			&::v-deep .article-description {
				font-size: 15px;
			}
		}

		@include on-mobile {
			padding: 14px 12px;
			overflow: auto;
		}
	}

	.article-flyer {
		width: 100%;

		margin-top: 1em;
		grid-area: media;

		border-radius: $border-radius;
	}

	@include on-mobile {
		overflow: hidden;
	}

	&.page-enter-active {
		.page-inner {
			position: relative;
			top: 100%;
			transition: top 0.25s;
		}

		&.page-enter-to {
			.page-inner {
				top: 0px;
			}
		}
	}

	&.page-leave-active {
		.page-inner {
			position: relative;
			top: 0%;
			transition: top 0.25s;
		}

		&.page-leave-to {
			.page-inner {
				top: 100%;
			}
		}
	}
}
</style>
