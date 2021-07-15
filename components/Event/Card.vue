<script lang="ts">
import ClubEvent from '@includes/models/ClubEvent'
import { Component } from 'nuxt-property-decorator'

@Component
export default class EventCard extends ClubEvent.ProppedSource {
	get event_types(): any[] | false {
		if (
			!this.club_event ||
			!this.club_event.categories ||
			!this.club_event.categories.length
		)
			return false

		return this.club_event.categories.filter(
			(c: any) => c.category_type === 'event'
		)
	}

	get bar_color() {
		if (!this.event_types || !this.event_types.length) return '#c5d0a6'
		return this.event_types[0].color
	}

	get bar_colors() {
		if (!this.event_types || !this.event_types.length) return []
		return this.event_types.map((cat: any) => cat.color).slice(0, 3)
	}

	get has_media() {
		const event = this.club_event
		if (event.media) return true
		else return false
	}
}

// open in modal
// $modal.open({ is: 'event-details-modal', event: club_event })

// open in page
// $router.push(`/events/${club_event.id}`)
</script>

<template>
	<card-colored-bar
		v-if="club_event && club_event.status === 'active'"
		class="event card-event"
		:class="{ 'has-media': has_media }"
		:color="bar_colors"
		@click.native="
			$modal.open({ is: 'event-details-modal', event: club_event })
		"
	>
		<club-media
			v-if="club_event.media && club_event.media.url"
			:media="club_event.media"
			size="medium"
			class="event-image"
		/>

		<div class="event-details">
			<div class="details-header">
				<div class="details-title-datetime">
					<event-location :event="club_event" />
					<event-title />
				</div>

				<div class="details-actions">
					<form-button class="action more-details flat outline">
						Details
						<i class="fas fa-chevron-right"></i>
					</form-button>
				</div>
			</div>

			<event-datetime :event="club_event" />

			<div class="details-description" v-html="club_event.snippet" />

			<div class="details-actions">
				<form-button class="action more-details flat outline">
					Details
					<i class="fas fa-chevron-right"></i>
				</form-button>
			</div>
		</div>
	</card-colored-bar>
</template>

<style lang="scss" scoped>
@import '@sassy';

.card.event::v-deep {
	.card-content {
		@include flex(row, flex-start, stretch);

		& > .details-description {
			display: none;
			width: 100%;
		}

		@media screen and (max-width: 550px) and (min-width: 450px) {
			// flex-wrap: wrap;

			.event-details {
				width: calc(100% - 110px);
			}

			// & > .details-description {
			// 	display: inherit;
			// 	width: 100%;
			// }
		}
	}
}

.card.event {
	z-index: 1;
	cursor: pointer;

	@media screen and (min-width: 1024px) {
		transform: scale(0.95);
		transition: transform 0.25s;

		&:hover {
			transform: scale(0.99);
			z-index: 99999;
			position: relative;

			&:active {
				transform: scale(0.85);
			}
		}
	}

	.event-image {
		width: 125px;
		height: 125px;
		object-fit: cover;
		margin-right: 20px;
		border-radius: $border-radius;

		@media screen and (max-width: 750px) {
			width: 100px;
			height: 100%;

			@media screen and (max-width: 450px) {
				width: 100%;
				height: 100px;

				margin: 0px;
				margin-bottom: 0.25em;
				&::v-deep img {
					object-fit: cover;
				}
			}
		}
	}

	.event-details {
		flex: 1;
		.details-title {
			font-size: 1em;
		}

		.event-datetime {
			font-size: 13px;
			font-weight: 400;

			@media screen and (max-width: 1024px) and (min-width: 876px) {
				font-size: 0.68em;

				@media screen and (max-width: 955px) {
					font-size: 0.7em;
				}
			}
		}

		& > .details-actions {
			display: none;
		}
	}

	.details-description {
		font-size: 0.9em;
		flex: 1;
	}

	.details-actions {
		flex-shrink: 0;

		.more-details.flat.outline {
			border: none;
			padding: 0.5em;
			margin-left: 0.5em;

			span {
				@include flex(row, flex-end, center);

				i {
					margin-left: 0.5em;
				}
			}
		}
	}
}

.card.event {
	@media screen and (max-width: 450px) {
		&::v-deep .card-content {
			@include flex(column);
		}

		.event-details {
			width: 100%;
		}
	}

	@media screen and (max-width: 475px) {
		&.has-media {
			padding: 0px;
			overflow: hidden;

			&::before {
				width: 8px;
				border-radius: $border-radius;
				// box-shadow: 0px 0px 3px 1px rgba(#000, 0.33);
			}

			&::v-deep .card-content {
				padding: 10px;
				padding-left: 0px;
			}
		}

		@media screen and (max-width: 350px) {
			&.has-media {
				.details-header {
					.details-actions {
						display: none;
					}
				}

				.event-details {
					& > .details-actions {
						@include flex(row, flex-end, center);
						width: 100%;
					}
				}
			}
		}
	}
}
</style>
