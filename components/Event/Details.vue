<script lang="ts">
import ClubEvent from '@includes/models/ClubEvent'
import ClubReservation from '@includes/models/ClubReservation'
import { Component, Watch, ProvideReactive } from 'nuxt-property-decorator'

@Component
export default class EventDetails extends ClubEvent.Injected {
	get element_classes() {
		return {
			'no-media': !this.club_event.media
		}
	}

	get start_date() {
		return this.club_event_start_moment.format('MMMM D, YYYY')
	}

	get start_time() {
		return this.club_event_start_moment.format('h:mm a')
	}

	get end_time() {
		const time = this.$moment(this.club_event.end_date)
		if (!time.isValid()) return false
		return time.format('h:mm a')
	}

	mounted() {
		if (
			!this.club_event.guests ||
			(!this.club_event.guests.length && this.club_event.id)
		) {
			this.$fetchClubEventGuests()
		}
	}

	// @Watch('club_event', { immediate: true })
	// mapEventToReservation(event: ClubEvent.Data) {
	// 	this.club_reservation.event = event
	// }
}
</script>

<template>
	<card class="event-details" :class="element_classes">
		<club-media
			v-if="club_event.media && club_event.media.url"
			:media="club_event.media"
			size="medium"
			class="event-image"
			openable
			no-title
		/>

		<event-location show-all />
		<event-title />
		<event-datetime />

		<div class="divider" />

		<!-- <div class="event-actions-mobile">
			<event-attendees-button :event="club_event" />
			<event-favorite-button :event="club_event" />
		</div> -->

		<div class="event-content">
			<div class="event-description" v-html="club_event.description" />

			<club-media
				v-if="club_event.flyer"
				class="event-flyer"
				:media="club_event.flyer"
				openable
				no-title
			/>
		</div>

		<event-actions />
	</card>
</template>

<style lang="scss" scoped>
@import '@sassy';

// Deep Styles

.event-description::v-deep {
	p {
		padding: 0.25em 0px;
	}
}

.event-details.card::v-deep {
	.event-attendees-button,
	.event-favorite-button {
		text-align: left;

		&::v-deep {
			.button-inner {
				@include grid(25px 1fr);
			}

			i {
				align-self: center;
				justify-self: start;
			}

			span {
				font-size: 0.8em;
			}

			@include on-mobile {
				.button-inner {
					display: block;
				}
			}
		}
	}

	.event-attendees-button {
		i {
			color: $color-primary;
		}
	}

	.event-actions {
		.event-favorite-button,
		.event-attendees-button {
			font-size: 0.9em;

			@include on-mobile {
				text-align: center;
			}
		}
	}
}

// Default Styles

.card.event-details {
	@include grid(
		140px 1fr auto,
		auto auto 5px auto minmax(0, 1fr),
		'eventmedia eventtitle eventdatetime'
			'eventmedia eventlocation eventdatetime' 'eventmedia divider divider'
			'eventmedia eventcontent eventcontent'
			'eventactions eventcontent eventcontent'
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

	.event-image {
		grid-area: eventmedia;

		width: 130px;
		height: 130px;
		object-fit: cover;
		border-radius: $border-radius;
	}

	.event-location {
		font-size: 0.8em;

		@include above-mobile {
			padding: 0.5em 0px;
		}
	}

	.event-datetime {
		// padding-right: 10px;
		font-size: 0.8em;
		white-space: nowrap;

		@include above-mobile {
			// padding-right: 25px;
			align-items: flex-end;
			justify-self: end;
		}
	}

	.divider {
		align-self: end;
		grid-area: divider;
		width: 100%;
		height: 1px;
		background-color: $that-gray;
	}

	.event-actions-mobile {
		display: none;
		grid-area: eventactionsmobile;

		.event-attendees-button,
		.event-favorite-button {
			font-size: 0.65em;
			text-align: center;
		}
	}

	.event-content {
		grid-area: eventcontent;
		width: 100%;
		max-height: 100%;
		// max-height: 90px;
		overflow: hidden;
		overflow-y: auto;
		padding-right: 10px;
		// border-radius: $border-radius;
		--scrollbar-size: 4px;

		.event-flyer {
			// width: 100%;
			margin: 0px auto;
			margin-top: 1em;
			margin-bottom: 1em;
			border-radius: $border-radius;
		}

		@include above-mobile {
			padding-top: 0.5em;
		}
	}

	.event-actions {
		width: 130px;
		// height: 100%;
	}
}

// Alternative Styles

.card.event-details:not(.no-media) {
	.event-datetime {
		font-size: 0.7em;
	}
}

.card.event-details.no-media {
	@include grid(
		140px 1fr auto,
		auto auto 5px auto minmax(0, 1fr),
		'eventactions eventtitle eventdatetime'
			'eventactions eventlocation eventdatetime' 'eventactions divider divider'
			'eventactions eventcontent eventcontent'
			'eventactions eventcontent eventcontent'
	);
	align-items: start;
	gap: 0.5em;
}

// Mobile Styles

.event-location::v-deep {
	@include on-mobile {
		i {
			margin: 0px;
			margin-left: 0.5em;
		}
	}
}

.card.event-details {
	@include on-mobile {
		@include grid(
			auto auto auto 100px 10px,
			auto auto auto auto minmax(0, 1fr),
			'eventtitle eventtitle eventtitle eventmedia .'
				'eventlocation eventlocation eventlocation eventmedia .'
				'eventdatetime eventdatetime eventdatetime eventmedia .'
				'. . . eventmedia .'
				'eventcontent eventcontent eventcontent eventcontent eventcontent'
				'eventactions eventactions eventactions eventactions eventactions'
		);
		gap: 0.5em;

		&:not(.no-media) .event-location {
			font-size: 0.7em;
		}

		.event-datetime {
			@include on-mobile(340px) {
				font-size: 0.65em;
			}
		}

		.event-actions-mobile {
			@include flex(row);
			padding-top: 1em;
			padding-bottom: 0.5em;

			& > * {
				flex: 1;
			}
		}

		.divider {
			display: none;
		}

		.event-content {
			--scrollbar-size: 2px;
			padding-right: 0px;
		}

		.event-actions {
			@include flex(row, space-between, stretch);
			flex-wrap: wrap;
			width: 100%;

			position: sticky;
			left: 0px;
			bottom: 0px;
			padding: 0.5em 1em;

			// @include glass-it(
			// 	linear-gradient(
			// 		90deg,
			// 		rgba(255, 255, 255, 0.8) 0%,
			// 		rgba(255, 255, 255, 0.78) 25%,
			// 		rgba(211, 247, 255, 0.75) 75%,
			// 		rgba(211, 247, 255, 0.85) 100%
			// 	),
			// 	50px
			// );
			@include glass-it(rgba(white, 0.65), 10px);

			border-top-left-radius: $border-radius;
			border-top-right-radius: $border-radius;

			&::v-deep {
				& > * {
					flex: 1 33%;
					margin: 0px;
				}

				.event-attendees-button {
					min-width: 135px;
				}

				.event-reserve-button {
					flex: 1 100%;
					order: 4;
					margin-top: 0.5em;
				}

				@include on-mobile(480px) {
					& > *,
					.event-reserve-button {
						flex: 1 50%;
					}

					.event-spaces {
						order: 3;
					}
				}
			}
		}
	}
}

.card.event-details.no-media {
	@include on-mobile {
		.event-location {
			@include flex(row-reverse, flex-end, center);
			float: right;
		}
	}
}
</style>
